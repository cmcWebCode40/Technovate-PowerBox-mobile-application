import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  fontPixel,
  formatDate,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/libs/utils';
import {
  DeviceInfoStatus,
  EnergyDeviceInfoCard,
} from '@/components/energy-device-cards';
import Video from 'react-native-video';
import {useAuthContext, useBluetoothContext} from '@/libs/context';
import {AddIcon, Modal, Typography} from '@/components/common';
import {RechargeEnergyForm} from '@/components/recharge-energy-form';
import {colors} from '@/libs/constants';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {DeviceSwitch} from '@/components/energy-device-cards/DeviceSwitch';
import {EnergyUsageProgressIndicator} from '@/components/energy-usage-progress-indicator';

export const HomeScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const [openModal, setOpenModal] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isRecharge, setIsRecharge] = useState(false);
  const [deviceState, setDeviceState] = useState<'ON' | 'OFF'>('OFF');
  const {energyMetric} = useBluetoothContext();
  const {user} = useAuthContext();

  useEffect(() => {
    const stateStatus = parseInt(energyMetric.ac_volt, 10) > 50 ? 'ON' : 'OFF';
    setDeviceState(stateStatus);
  }, [energyMetric.ac_volt, energyMetric.state]);

  const info: {type: DeviceInfoStatus; value: string}[] = [
    {
      type: 'AC_CURRENT',
      value: `${energyMetric?.battery_voltage}%`,
    },
    {
      type: 'POWER_CONSUMPTION',
      value: `${Number(energyMetric.power).toFixed(1)} W`,
    },
    {
      type: 'FREQUENCY',
      value: `${Number(energyMetric.consumption).toFixed(3)} KWh`,
    },
    {
      type: 'AC_VOLTAGE',
      value: `${Number(energyMetric.ac_volt).toFixed(1)} V`,
    },
  ];

  const rechargeInverter = () => {
    setOpenModal(true);
  };

  const switchDeviceState = async () => {
    const state = deviceState === 'ON' ? '0' : '1';
    try {
      setIsSwitching(true);
      const response = await axios.get(
        `https://api.thingspeak.com/update?api_key=PIC7O5616PV9V04P&field7=${state}`,
      );
      // TODO: Infinite Recursion Risk fix
      if (response.data <= 0) {
        switchDeviceState();
      } else {
        setIsSwitching(false);
      }
    } catch (error) {
      Alert.alert('Error occurred');
    }
  };

  const rechargeMeter = async (unitValue: string) => {
    try {
      setIsRecharge(true);
      const response = await axios.get(
        `https://api.thingspeak.com/update?api_key=PIC7O5616PV9V04P&field8=${unitValue}`,
      );
      // TODO: Infinite Recursion Risk fix
      if (response.data <= 0) {
        if (unitValue) {
          rechargeMeter(unitValue);
        }
      } else {
        setIsRecharge(false);
        setOpenModal(false);
        showMessage({
          message: 'PowerBox Recharge of units successfully made',
          type: 'success',
        });
      }
    } catch (error) {
      Alert.alert('Error occurred');
    }
  };

  return (
    <View style={style.container}>
      <Video
        source={require('../../assets/galaxy.mp4')}
        style={style.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
        <ScrollView
          style={style.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={style.deviceStatus}>
            <View>
              <Typography style={style.greeting}>
                Hello, {user?.firstName}.
              </Typography>
              <Typography variant="b2">
               {formatDate(new Date())}
              </Typography>
            </View>
            <View
              style={[
                style.status,
                style.deviceStateStatus,
                deviceState === 'OFF' && {backgroundColor: colors.red[200]},
              ]}>
              <Typography
                style={[style.statusText, style.deviceStateStatusText]}>
                {deviceState}
              </Typography>
            </View>
          </View>
          <View style={style.progressIndicatorContainer}>
            <EnergyUsageProgressIndicator balance={energyMetric.bal_unit} />
          </View>
          <View style={style.infoContainer}>
            {info.map((item, index) => (
              <View
                style={[style.infoCard, actionCardStyle(index)]}
                key={item.type}>
                <EnergyDeviceInfoCard type={item.type} value={item.value} />
              </View>
            ))}
          </View>
          <DeviceSwitch
            isLoading={isSwitching}
            onSwitch={switchDeviceState}
            color={deviceState === 'ON' ? colors.green[500] : colors.red[200]}
          />
          <TouchableOpacity activeOpacity={0.6} onPress={rechargeInverter} style={style.btnContainer}>
            <View style={style.iconContainer}>
              <AddIcon color={colors.white[100]} />
            </View>
            <Typography variant="b2" style={style.textIcon}>Recharge</Typography>
          </TouchableOpacity>
        </ScrollView>
      {/* </ImageBackground> */}
      <Modal
        onClose={() => setOpenModal(false)}
        title="PowerBox Recharge"
        visible={openModal}>
        <RechargeEnergyForm
          isLoading={isRecharge}
          rechargeMeter={rechargeMeter}
        />
      </Modal>
    </View>
  );
};

const actionCardStyle = (index: number): ViewStyle => ({
  marginRight: index % 2 === 0 ? '5%' : 0,
  marginLeft: index % 2 !== 0 ? '5%' : 0,
  marginTop: '3%',
});

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      justifyContent: 'space-between',
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
    },
    greeting: {
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeBold,
    },
    deviceStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: pixelSizeVertical(24),
    },
    status: {
      borderRadius: theme.radius.xxl,
      paddingVertical: pixelSizeVertical(8),
      paddingHorizontal: pixelSizeHorizontal(16),
    },
    statusText: {
      fontSize: fontPixel(theme.fontSize.m),
      fontWeight: 'bold',
      fontFamily: theme.fonts.ManropeBold,
    },
    devicePowerStatus: {
      backgroundColor: theme.colors.red[100],
    },
    devicePowerStatusText: {
      color: theme.colors.red[200],
    },
    deviceStateStatus: {
      backgroundColor: theme.colors.green[500],
      borderRadius: theme.radius.xxl,
      paddingVertical: pixelSizeVertical(8),
      paddingHorizontal: pixelSizeHorizontal(16),
    },
    deviceStateStatusText: {
      color: theme.colors.white[100],
    },
    infoContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      // paddingHorizontal: pixelSizeHorizontal(8),
    },
    progressIndicatorContainer: {
      marginHorizontal: 'auto',
      marginVertical: pixelSizeVertical(20),
    },
    infoCard: {
      width: '42%',
      marginBottom: pixelSizeVertical(16),
    },
    indicator: {
      height: heightPixel(20),
      width: heightPixel(20),
      borderRadius: theme.radius.full,
      marginRight: pixelSizeHorizontal(8),
    },
    energyChartContainer: {
      marginTop: pixelSizeVertical(32),
    },
    device: {
      fontSize: theme.fontSize.m,
    },
    bValueText: {
      fontSize: theme.fontSize.xl,
    },
    scrollContainer: {
      // paddingBottom: pixelSizeVertical(24),
    },
    btnContainer: {
      marginBottom: pixelSizeVertical(32),
      marginTop: pixelSizeVertical(24),
      position: 'absolute',
      bottom: '-2%',
      right: '0%',
    },
    iconContainer: {
      height:70,
      width:70,
      backgroundColor:theme.colors.green[200],
      justifyContent:'center',
      alignItems:'center',
      borderRadius:theme.radius.full,
      shadowColor: theme.colors.white[100],
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    textIcon:{
      fontWeight:'600',
      marginTop:10,
      marginLeft:pixelSizeHorizontal(12),
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });
};
