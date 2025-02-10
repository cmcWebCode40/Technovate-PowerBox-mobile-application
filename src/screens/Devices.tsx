import {View, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {EnergyDeviceCard} from '@/components/energy-device-cards';
import {useBluetoothContext} from '@/libs/context';
import {EnergyUsageChart} from '@/components/chart';
import DevicePlanOverviewCard from '@/components/recharge-energy-form/DevicePlanOverviewCard';

export const DevicesScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const {energyMetric} = useBluetoothContext();
  return (
    <View style={style.container}>
      <ScrollView style={style.content}>
        <DevicePlanOverviewCard />
        <View style={{marginVertical:12}}>
        <EnergyDeviceCard
          socketNo={'1'}
          power={energyMetric.power}
          state={'off'}
          balance={energyMetric.bal_unit}
          voltage={energyMetric.ac_volt}
        />
          {/* <EnergyUsageChart value={parseInt(energyMetric.power, 10)} /> */}
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
    content: {
      marginTop: pixelSizeVertical(48),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
  });
};
