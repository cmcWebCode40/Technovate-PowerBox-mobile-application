import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {
  EnergyDeviceCard,
  EnergyDeviceInfoCard,
} from '@/components/energy-device-cards';
import {useAuthContext, useBluetoothContext, useMqttContext} from '@/libs/context';
import DevicePlanOverviewCard from '@/components/recharge-energy-form/DevicePlanOverviewCard';
import {BatteryIcon} from '@/components/common';
import transactionService from '@/libs/server/Transaction';
import { showMessage } from 'react-native-flash-message';

export const DevicesScreen: React.FunctionComponent = () => {
  const [paidAmount] = useState<string|undefined>(undefined);
  const style = useThemedStyles(styles);
  const {energyMetric} = useBluetoothContext();
  const {deviceReading, switchUpsMode, connectivity} = useMqttContext();
  const {user} = useAuthContext();

  const cells: {title: string; value: string}[] = [
    {
      title: 'Battery RCC',
      value: `${deviceReading?.battRCC?.toFixed(2)}Ah`,
    },
    {
      title: 'Battery FCC',
      value: `${deviceReading?.battFCC?.toFixed(2)}Ah`,
    },
    {
      title: 'Battery Current',
      value: `${deviceReading?.chargeCurrent?.toFixed(2)}A`,
    },
    {
      title: 'Battery Health',
      value: `${deviceReading?.battHealth?.toFixed(2)}%`,
    },
    {
      title: 'Battery %',
      value: `${deviceReading?.battPercent?.toFixed(2)}%`,
    },
    {
      title: 'Battery Volt',
      value: `${deviceReading?.battVolt?.toFixed(2)} V`,
    },
  ];



  useEffect(() => {
    (async ()=>{
       try {
        await transactionService.getTotalTransactionsAmountByStatus('SUCCESSFUL');
          // const formatted = amount?.toFixed(2);
          // setPaidAmount(formatted);
       } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
       }
    })();
  }, []);

  return (
    <View style={style.container}>
      <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
        <DevicePlanOverviewCard paidAmount={paidAmount} />
        <View style={style.details}>
          <EnergyDeviceCard
            socketNo={user?.powerBoxId}
            power={String(energyMetric.usage)}
            upsFlag={deviceReading.upsFlag}
            balance={deviceReading.balUnit}
            voltage={deviceReading.battVolt}
            upsFlagHandler={()=>{
              if (connectivity.deviceStatus === 'offline') {
                showMessage({
                  position:'bottom',
                  message: 'Device is currently offline',
                  type: 'warning',
                });
                return;
              }
              switchUpsMode(deviceReading.upsFlag);
            }}
          />
          <View style={style.infoContainer}>
            {cells.map((item) => (
              <View
                style={[style.infoCard]}
                key={item.title}>
                <EnergyDeviceInfoCard
                  icon={<BatteryIcon />}
                  title={item.title}
                  value={item.value}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
      justifyContent: 'space-between',
      paddingBottom: pixelSizeVertical(40),
    },
    details: {
      marginVertical: 12,
    },
    content: {
      marginTop: pixelSizeVertical(16),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
    infoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal:'auto',
    },
    infoCard: {
      width: '48%',
      flexGrow:1,
    },
  });
};
