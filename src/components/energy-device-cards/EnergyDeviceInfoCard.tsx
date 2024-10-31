import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  AcVoltIcon,
  ElectricPlugIcon,
  FrequencyIcon,
  LargePlugIcon,
  PlugIcon,
  Typography,
  WarningIcon,
} from '../common';
import {colors} from '@/libs/constants';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  fontPixel,
  pixelSizeVertical,
} from '@/libs/utils';
import {GradientBox} from '../linear-gradients/GradientBox';
const {orange, blue, green} = colors;

export type DeviceInfoStatus =
  | 'AC_VOLTAGE'
  | 'AC_CURRENT'
  | 'POWER_CONSUMPTION'
  | 'FREQUENCY';

const statues = {
  AC_CURRENT: {
    icon: <ElectricPlugIcon color={orange[500]} />,
    color: orange[500],
    title: 'Battery level',
    borderColor:[colors.yellow[100], colors.orange[500]],
  },
  AC_VOLTAGE: {
    icon: <AcVoltIcon />,
    color: orange[500],
    title: 'AC Voltage',
    borderColor:[colors.green[500], colors.green[300]],
  },
  FREQUENCY: {
    icon: <PlugIcon size={32} color={colors.green[500]} />,
    color: green[400],
    title: 'Usage',
    borderColor:[colors.white[100], colors.white[300]],
  },
  POWER_CONSUMPTION: {
    icon: <ElectricPlugIcon />,
    color: blue[100],
    title: 'Power ',
    borderColor:[colors.blue[100], colors.blue[300]],
  },
};
interface EnergyDeviceInfoCardProps {
  type: DeviceInfoStatus;
  value: string;
}

export const EnergyDeviceInfoCard: React.FunctionComponent<
  EnergyDeviceInfoCardProps
> = ({type, value}) => {
  const style = useThemedStyles(styles);

  return (
      <GradientBox colors={statues[type].borderColor}>
          <View style={style.container}>
            {statues[type].icon}
            <Typography variant="b2" style={style.title}>
              {statues[type].title}
            </Typography>
            <Typography style={style.info}>{value}</Typography>
          </View>
      </GradientBox>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeBold,
      color: theme.colors.white[100],
      marginVertical: pixelSizeVertical(8),
    },
    info: {
      fontSize: fontPixel(24),
      color: theme.colors.white[100],
    },
  });
};
