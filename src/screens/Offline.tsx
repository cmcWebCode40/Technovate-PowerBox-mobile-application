import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {createHitSlop, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {
  DeviceInfoStatus,
  EnergyDeviceInfoCard,
  OfflineOverview,
} from '@/components/energy-device-cards';
import {useAuthContext, useBluetoothContext} from '@/libs/context';
import {BatteryIcon, Button, Typography} from '@/components/common';
import {showMessage} from 'react-native-flash-message';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {useNavigation} from '@react-navigation/native';
import { ScreenLayout } from '@/components/common/layout';

export const OfflineScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const {energyMetric} = useBluetoothContext();
  const {user} = useAuthContext();
  const {characteristics, devicePowerControl, loadingState, disconnectPeripheral} =
    useBluetoothContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  const cells: {title: string; value: string}[] = [
    {
      title: 'Battery RCC',
      value: `${energyMetric?.battRCC?.toFixed(2)} mAh`,
    },
    {
      title: 'Battery FCC',
      value: `${energyMetric?.battFCC?.toFixed(2)} mAh`,
    },
    {
      title: 'Battery Current',
      value: `${energyMetric?.chargeCurrent?.toFixed(2)} A`,
    },
    {
      title: 'Battery Health',
      value: `${energyMetric?.battHealth?.toFixed(2)} %`,
    },
    {
      title: 'Battery %',
      value: `${energyMetric?.battPercent?.toFixed(2)} %`,
    },
    {
      title: 'Battery Volt',
      value: `${energyMetric?.battVolt?.toFixed(2)} V`,
    },
  ];

  const info: {type: DeviceInfoStatus; value: string}[] = [
    {
      type: 'POWER_CONSUMPTION',
      value: `${energyMetric?.chargeCurrent?.toFixed(2)} W`,
    },
    {
      type: 'FREQUENCY',
      value: '50HZ',
    },
    {
      type: 'AC_VOLTAGE',
      value: `${energyMetric?.acVolt?.toFixed(2)} V`,
    },
    {
      type: 'USAGE',
      value: `${energyMetric?.usage?.toFixed(2)} KWh`,
    },
    {
      type: 'INVERTER_STATE',
      value: `${energyMetric?.state}`,
    },
    {
      type: 'DEVICE_STATE',
      value: `${energyMetric?.deviceState}`,
    },
    {
      type: 'MODE',
      value: `${energyMetric?.mode}`,
    },
  ];

  const connectBle = () => {
    navigation.navigate('AddDevice');
  };

  const disconnect = () => {
    if (characteristics?.peripheralId) {
      disconnectPeripheral(characteristics.peripheralId);
    }
  };

  const loadUnit = () => {
    navigation.navigate('OfflineTransactions');
  };

  const wifiSettings = () => {
    navigation.navigate('WifiSetting');
  };

  return (
    <ScreenLayout style={style.container}>
      <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
        <Typography style={style.header}>Offline Mode</Typography>
        <View style={style.details}>
          <OfflineOverview
          isToggling={loadingState.isToggling}
            state={energyMetric.state}
            socketNo={user?.powerBoxId}
            isConnected={!!characteristics}
            upsFlag={energyMetric.upsFlag}
            balance={energyMetric.balUnit}
            toggleControl={() => {
              devicePowerControl(energyMetric.deviceId);
            }}
            upsFlagHandler={() => {
              if (!characteristics) {
                showMessage({
                  position: 'bottom',
                  message: 'Device is currently offline',
                  type: 'warning',
                });
                return;
              }
              //   switchUpsMode(energyMetric.upsFlag);
            }}
          />
          {!characteristics ? (
            <>
              <View style={style.wifi}>
                <View />
                <TouchableOpacity hitSlop={createHitSlop(20)} onPress={wifiSettings}>
                  <Typography style={style.wifiText}>Wifi Settings</Typography>
                </TouchableOpacity>
              </View>
              <View>
                <View style={style.infoContainer}>
                  {cells.map(item => (
                    <View style={[style.infoCard]} key={item.title}>
                      <EnergyDeviceInfoCard
                        icon={<BatteryIcon />}
                        title={item.title}
                        value={item.value}
                      />
                    </View>
                  ))}
                </View>
                <View style={style.infoContainer}>
                  {info.map(item => (
                    <View style={[style.infoCard]} key={item.type}>
                      <EnergyDeviceInfoCard
                        type={item.type}
                        value={item.value}
                      />
                    </View>
                  ))}
                </View>
                <View style={style.btnContainer}>
                  <Button
                    onPress={loadUnit}
                    variant="contained"
                    style={style.btnActions}>
                    Load Unit.
                  </Button>
                  <Button
                    variant="text"
                    onPress={disconnect}
                    style={style.btnActions}>
                    Disconnect BLE
                  </Button>
                </View>
              </View>
            </>
          ) : (
            <Button onPress={connectBle}>Connect With Bluetooth</Button>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
      justifyContent: 'space-between',
      paddingBottom: pixelSizeVertical(40),
    },
    details: {
      marginVertical: 12,
    },
    content: {
      marginTop: pixelSizeVertical(24),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
    infoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    wifi: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    infoCard: {
      width: '48%',
      flexGrow: 1,
    },
    header: {
      textAlign: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom:'15%',
    },
    btnActions: {
      width: '48%',
      borderRadius: theme.radius.lg,
    },
    wifiText: {
      textDecorationLine: 'underline',
      fontWeight: '600',
    },
  });
};
