import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useThemedStyles, useTransactions} from '@/libs/hooks';
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
import {useAuthContext, useMqttContext} from '@/libs/context';
import {
  AddIcon,
  ChargingBatteryIcon,
  Modal,
  Typography,
} from '@/components/common';
import {RechargeEnergyForm} from '@/components/recharge-energy-form';
import {colors} from '@/libs/constants';
import {DeviceSwitch} from '@/components/energy-device-cards/DeviceSwitch';
import {EnergyUsageProgressIndicator} from '@/components/energy-usage-progress-indicator';
import RechargePreviewCard from '@/components/recharge-energy-form/RechargePreviewCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TransactionStatusCard from '@/components/recharge-energy-form/TransactionStatusCard';
import transactionService, {TransactionStatus} from '@/libs/server/Transaction';
import {BackDrop} from '@/components/common/modal/BackDrop';
import { showMessage } from 'react-native-flash-message';
import { ScreenLayout } from '@/components/common/layout';

type TransactionStatusVerification = {
  isVerifying: boolean;
  unitLoaded: boolean;
  status?: TransactionStatus;
};

type HomeScreenProps = NativeStackScreenProps<any, 'Home'>;

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = ({
  route,
}) => {
  const style = useThemedStyles(styles);
  const [transactionStatusDetails, setTransactionStatusDetails] =
    useState<TransactionStatusVerification>({
      isVerifying: false,
      status: undefined,
      unitLoaded: false,
    });
  const {user} = useAuthContext();
  const {params} = route as unknown as {
    params: {transRef: string; amount: string};
  };
  const {
    openModal,
    isRecharge,
    closeModal,
    removeParams,
    paymentInfo,
    proceedToPay,
    displayModal,
    proceedToPreview,
    viewTransactionDetails,
  } = useTransactions();
  const {
    deviceReading,
    deviceUnitTopUp,
    devicePowerControl,
    loadingState,
    connectivity,
  } = useMqttContext();

  useEffect(() => {
    if (params?.transRef) {
      verifyTransaction();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.transRef]);


  const handlePowerToggle = ()=>{
    if (connectivity.deviceStatus === 'offline') {
      showMessage({
        message:
          'Your inverter is offline. Connect via Bluetooth if you\'re nearby to continue.',
        type: 'warning',
      });
      return;
    }
    devicePowerControl();

  };
  const verifyTransaction = useCallback(async () => {
    try {
      if (!params?.transRef) {
        return;
      }
      setTransactionStatusDetails(state => ({...state, isVerifying: true}));
      const response = await transactionService.verifyTransaction(
        params?.transRef,
        params.amount,
        connectivity.deviceStatus,
      );
      if (response.loadStatus === 'SUCCESSFUL') {
        const amount = Number(params.amount) / 100;
        await deviceUnitTopUp(String(amount), params?.transRef);
        setTransactionStatusDetails(state => ({...state}));
      }
      if (response?.status) {
        setTransactionStatusDetails({
          isVerifying: false,
          unitLoaded: false,
          status: response.status as any,
        });
      }
      removeParams({
        transRef: undefined,
      });
      displayModal();
    } catch {
      return;
    } finally {
      setTransactionStatusDetails(state => ({
        ...state,
        isVerifying: false,
        unitLoaded: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.transRef, removeParams]);

  const info: {type: DeviceInfoStatus; value: string}[] = [
    {
      type: 'AC_CURRENT',
      value: `${deviceReading?.battPercent?.toFixed(2)}%`,
    },
    {
      type: 'POWER_CONSUMPTION',
      value: `${deviceReading?.chargeCurrent?.toFixed(2)} W`,
    },
    {
      type: 'FREQUENCY',
      value: `${deviceReading?.battVolt?.toFixed(2)} KWh`,
    },
    {
      type: 'AC_VOLTAGE',
      value: `${deviceReading?.acVolt?.toFixed(2)} V`,
    },
    {
      type: 'USAGE',
      value: `${deviceReading?.usage?.toFixed(2)} KWh`,
    },
    {
      type: 'BATTERY_HEALTH',
      value: `${deviceReading?.battHealth?.toFixed(2)} V`,
    },
    {
      type: 'DEVICE_STATE',
      value: `${deviceReading?.deviceState}`,
    },
    {
      type: 'MODE',
      value: `${deviceReading?.mode}`,
    },
  ];

  const rechargeInverter = () => {
    displayModal();
  };

  return (
    <ScreenLayout style={style.container}>
      <BackDrop isLoading={transactionStatusDetails.isVerifying} />
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
            <Typography variant="b2">{formatDate(new Date())}</Typography>
          </View>
          {deviceReading?.state === 'charging' ? (
            <ChargingBatteryIcon size={40} />
          ) : (
            <View
              style={[
                style.status,
                deviceReading?.state === 'on' && style.deviceStateStatus,
                deviceReading?.state === 'off' && {
                  backgroundColor: colors.red[200],
                },
              ]}>
              <Typography
                style={[style.statusText, style.deviceStateStatusText]}>
                {deviceReading?.state === 'on'
                  ? 'ON'
                  : deviceReading?.state === 'lock'
                  ? 'LOCK'
                  : 'off'}
              </Typography>
            </View>
          )}
        </View>
        <View style={style.progressIndicatorContainer}>
          <EnergyUsageProgressIndicator balance={deviceReading.balUnit} />
        </View>
        <View style={style.connectivity}>
          <Typography variant="b1" style={[style.offlineText]}>
            Inverter Internet Connectivity:
          </Typography>
          <Typography
            variant="b1"
            style={[
              style.offlineText,
              connectivity.deviceStatus === 'online'
                ? style.deviceOnline
                : style.deviceOffline,
            ]}>
            {connectivity.deviceStatus}
          </Typography>
        </View>

        <View style={style.infoContainer}>
          {info.map(item => (
            <View style={[style.infoCard]} key={item.type}>
              <EnergyDeviceInfoCard type={item.type} value={item.value} />
            </View>
          ))}
        </View>
        <View style={{marginBottom:'15%'}}>
        <DeviceSwitch
          onSwitch={handlePowerToggle}
          isLoading={loadingState.isToggling}
          color={
            connectivity.deviceStatus === 'offline'
              ? colors.gray[200]
              : deviceReading.state === 'off'
              ? colors.green[500]
              : colors.red[200]
          }
        />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={rechargeInverter}
          style={style.btnContainer}>
          <View style={style.iconContainer}>
            <AddIcon color={colors.white[100]} />
          </View>
          <Typography variant="b2" style={style.textIcon}>
            Recharge
          </Typography>
        </TouchableOpacity>
        </View>

      </ScrollView>
      <Modal
        onClose={() => {
          setTransactionStatusDetails({
            isVerifying: false,
            unitLoaded: false,
            status: undefined,
          });
          closeModal();
        }}
        title="PowerBox Recharge"
        visible={openModal}>
        {transactionStatusDetails.status ? (
          <TransactionStatusCard
            status={transactionStatusDetails.status}
            onViewDetails={viewTransactionDetails}
            unitLoaded={transactionStatusDetails.unitLoaded}
          />
        ) : (
          <>
            {paymentInfo.deviceId ? (
              <RechargePreviewCard
                isLoading={isRecharge}
                pay={proceedToPay}
                {...paymentInfo}
              />
            ) : (
              <RechargeEnergyForm
                isLoading={isRecharge}
                rechargeMeter={proceedToPreview}
              />
            )}
          </>
        )}
      </Modal>
    </ScreenLayout>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      justifyContent: 'space-between',
      paddingVertical: pixelSizeVertical(16),
      paddingLeft: pixelSizeHorizontal(10),
      paddingRight:6,
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
      paddingHorizontal: pixelSizeHorizontal(6),
    },
    status: {
      borderRadius: theme.radius.full,
      paddingVertical: pixelSizeVertical(4),
      borderWidth: 3,
      borderColor: theme.colors.black[300],
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
      borderRadius: theme.radius.full,
      paddingVertical: pixelSizeVertical(4),
      paddingHorizontal: pixelSizeHorizontal(16),
    },
    deviceStateStatusText: {
      color: theme.colors.white[100],
    },
    infoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: '15%',
    },
    progressIndicatorContainer: {
      marginHorizontal: 'auto',
      marginVertical: pixelSizeVertical(20),
    },
    infoCard: {
      width: '48%',
      flexGrow: 1,
      // marginBottom: pixelSizeVertical(16),
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
      height: 70,
      width: 70,
      backgroundColor: theme.colors.blue[200],
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.radius.full,
      shadowColor: theme.colors.black[200],
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 3,
      borderColor: theme.colors.black[400],
      marginRight:10,
    },
    textIcon: {
      fontWeight: '700',
      marginTop: 10,
      textAlign:'center',
      fontFamily:theme.fonts.ManropeSemibold,
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
    offline: {
      paddingVertical: 2,
      paddingHorizontal: 12,
      borderRadius: theme.radius.xxl,
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
      marginHorizontal: 'auto',
      borderWidth: 3,
      borderColor: theme.colors.black[300],
      marginTop: pixelSizeVertical(20),
    },
    offlineText: {
      textAlign: 'left',
      fontWeight: '600',
      fontSize: 12,
      textTransform: 'uppercase',
      marginRight: 4,
      fontFamily: theme.fonts.ManropeBold,
    },
    deviceOnline: {
      color: theme.colors.green[200],
    },
    deviceOffline: {
      color: theme.colors.red[200],
    },
    connectivity: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
  });
};
