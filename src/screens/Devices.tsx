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
import { ScreenLayout } from '@/components/common/layout';
import { useSmartInverterChannel } from '@/libs/hooks/useSmartInverterChannel';

export const DevicesScreen: React.FunctionComponent = () => {
  const [paidAmount] = useState<string|undefined>(undefined);
  const style = useThemedStyles(styles);
  const {energyMetric} = useBluetoothContext();
  const { connectivity} = useMqttContext();
  const {user} = useAuthContext();
  const {inverterReading, toggleUpsMode} = useSmartInverterChannel();

  const cells: {title: string; value: string}[] = [
    {
      title: 'Cell 1',
      value: `${inverterReading?.cell1?.toFixed(2)} mAh`,
    },
    {
      title: 'Cell 2',
      value: `${inverterReading?.cell2?.toFixed(2)} mAh`,
    },
    {
      title: 'Cell 3',
      value: `${inverterReading?.cell2?.toFixed(2)} mAh`,
    },
    {
      title: 'Cell 4',
      value: `${inverterReading?.cell4?.toFixed(2)} mAh`,
    },
    {
      title: 'Battery RCC',
      value: `${inverterReading?.battRCC?.toFixed(2)} mAh`,
    },
    {
      title: 'Battery FCC',
      value: `${inverterReading?.battFCC?.toFixed(2)} mAh`,
    },
    {
      title: 'Battery Current',
      value: `${inverterReading?.chargeCurrent?.toFixed(2)} A`,
    },
    {
      title: 'Battery Health',
      value: `${inverterReading?.battHealth?.toFixed(2)}%`,
    },
    {
      title: 'Battery %',
      value: `${inverterReading?.battPercent?.toFixed(2)}%`,
    },
    {
      title: 'Battery Volt',
      value: `${inverterReading?.battVolt?.toFixed(2)} V`,
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
    <ScreenLayout style={style.container}>
      <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
        <DevicePlanOverviewCard paidAmount={paidAmount} />
        <View style={style.details}>
          <EnergyDeviceCard
            socketNo={user?.powerBoxId}
            power={String(energyMetric.usage)}
            upsFlag={inverterReading.upsFlag}
            balance={inverterReading.balUnit}
            voltage={inverterReading.battVolt}
            upsFlagHandler={()=>{
              if (connectivity.deviceStatus === 'offline') {
                showMessage({
                  position:'bottom',
                  message: 'Device is currently offline',
                  type: 'warning',
                });
                return;
              }
              toggleUpsMode(inverterReading.upsFlag);
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
    </ScreenLayout>
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
      marginBottom:'15%',
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
