import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  AcVoltIcon,
  BatteryCellIcon,
  DeviceStateIcon,
  ElectricPlugIcon,
  IndicatorIcon,
  PlugIcon,
  Typography,
  UsageIcon,
} from '../common';
import {colors} from '@/libs/constants';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {fontPixel, pixelSizeVertical} from '@/libs/utils';
const {orange, blue, green} = colors;

export type DeviceInfoStatus =
  | 'AC_VOLTAGE'
  | 'AC_CURRENT'
  | 'POWER_CONSUMPTION'
  | 'FREQUENCY'
  | 'USAGE'
  | 'DEVICE_STATE'
  | 'MODE'
  | 'INVERTER_STATE'
  | 'BATTERY_HEALTH';

const ICON_SIZE = 24;

const statues = {
  AC_CURRENT: {
    icon: <ElectricPlugIcon size={ICON_SIZE} color={orange[500]} />,
    color: orange[500],
    title: 'Battery level',
    borderColor: [colors.yellow[100], colors.orange[500]],
  },
  AC_VOLTAGE: {
    icon: <AcVoltIcon size={ICON_SIZE} />,
    color: orange[500],
    title: 'AC Voltage',
    borderColor: [colors.green[500], colors.green[300]],
  },
  FREQUENCY: {
    icon: <PlugIcon size={ICON_SIZE} color={colors.green[500]} />,
    color: green[400],
    title: 'Frequency',
    borderColor: [colors.white[100], colors.white[300]],
  },
  POWER_CONSUMPTION: {
    icon: <ElectricPlugIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'Power',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
  USAGE: {
    icon: <UsageIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'Usage',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
  BATTERY_HEALTH: {
    icon: <BatteryCellIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'BAttery Health',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
  DEVICE_STATE: {
    icon: <DeviceStateIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'Device State',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
  MODE: {
    icon: <ElectricPlugIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'Mode',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
  INVERTER_STATE: {
    icon: <IndicatorIcon size={ICON_SIZE} />,
    color: blue[100],
    title: 'Inverter State',
    borderColor: [colors.blue[100], colors.blue[300]],
  },
};
interface EnergyDeviceInfoCardProps {
  type?: DeviceInfoStatus;
  value: string;
  title?: string;
  icon?: React.ReactNode;
}

export const EnergyDeviceInfoCard: React.FunctionComponent<
  EnergyDeviceInfoCardProps
> = ({type = 'AC_CURRENT', value, title, icon}) => {
  const style = useThemedStyles(styles);

  return (
    <View style={style.container}>
      {icon ?? statues[type].icon}
      <View style={style.content}>
        <Typography variant="b2" style={style.title}>
          {title ?? statues[type].title}
        </Typography>
        <Typography style={style.info}>{value}</Typography>
      </View>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: theme.colors.black[200],
      borderRadius: theme.radius.md,
      paddingVertical: pixelSizeVertical(10),
      paddingHorizontal: pixelSizeVertical(4),
      shadowColor: theme.colors.black[300],
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginRight: 4,
      marginBottom: 4,
    },
    title: {
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeBold,
      color: theme.colors.white[100],
      fontSize: 10,
      marginBottom: pixelSizeVertical(8),
    },
    info: {
      fontSize: fontPixel(12),
      color: theme.colors.white[100],
    },
    content: {
      marginLeft: 3,
    },
  });
};
