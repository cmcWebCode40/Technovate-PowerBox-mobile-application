import {View, StyleSheet, ScrollView, ViewStyle, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {
  EnergyDeviceCard,
  EnergyDeviceInfoCard,
} from '@/components/energy-device-cards';
import {useAuthContext, useMqttContext} from '@/libs/context';
import DevicePlanOverviewCard from '@/components/recharge-energy-form/DevicePlanOverviewCard';
import {BatteryIcon} from '@/components/common';
import transactionService from '@/libs/server/Transaction';
import { showMessage } from 'react-native-flash-message';

export const DevicesScreen: React.FunctionComponent = () => {
  const [paidAmount] = useState<string|undefined>(undefined);
  const style = useThemedStyles(styles);
  const {deviceReading, switchUpsMode, connectivity} = useMqttContext();
  const {user} = useAuthContext();

  const cells: {title: string; value: string}[] = [
    {
      title: 'CELL 1',
      value: `${deviceReading?.cell1?.toFixed(2)} V`,
    },
    {
      title: 'CELL 2',
      value: `${deviceReading?.cell2?.toFixed(2)} V`,
    },
    {
      title: 'CELL 3',
      value: `${deviceReading?.cell3?.toFixed(2)} V`,
    },
    {
      title: 'CELL 4',
      value: `${deviceReading?.cell4?.toFixed(2)} V`,
    },
  ];



  useEffect(() => {
    (async ()=>{
       try {
        await transactionService.getTotalTransactionsAmountByStatus('SUCCESSFUL');
       } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
       }
    })();
  }, []);

  return (
    <View style={style.container}>
      <ScrollView style={style.content}>
        <DevicePlanOverviewCard paidAmount={paidAmount} />
        <View style={style.details}>
          <EnergyDeviceCard
            socketNo={user?.powerBoxId}
            power={''}
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
            {cells.map((item, index) => (
              <View
                style={[style.infoCard, actionCardStyle(index)]}
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

const actionCardStyle = (index: number): ViewStyle => ({
  marginRight: index % 2 === 0 ? '5%' : 0,
  marginLeft: index % 2 !== 0 ? '5%' : 0,
  marginTop: '3%',
});

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
      marginTop: pixelSizeVertical(48),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
    infoContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      // paddingHorizontal: pixelSizeHorizontal(8),
    },
    infoCard: {
      width: '42%',
      marginBottom: pixelSizeVertical(16),
    },
  });
};
