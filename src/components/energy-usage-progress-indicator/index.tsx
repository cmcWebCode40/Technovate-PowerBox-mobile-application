import React from 'react';
import {Typography, WireLessIcon} from '../common';
import {StyleSheet, View} from 'react-native';
import {Theme, theme as themes} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {fontPixel, pixelSizeHorizontal} from '@/libs/utils';

interface EnergyUsageProgressIndicatorProps {
  invertColor?: boolean;
  balance: number;
}

export const EnergyUsageProgressIndicator: React.FunctionComponent<
  EnergyUsageProgressIndicatorProps
> = ({invertColor, balance = 0}) => {
  const style = useThemedStyles(styles);
  const {
    colors: {orange, green},
  } = themes;
  const wirelessColor = invertColor ? orange[400] : green[300];

  return (
    <View style={style.content}>
      <WireLessIcon color={wirelessColor}  size={40}/>
      <Typography style={style.progressTitle} variant="h1">
        {balance} unit
      </Typography>
      <Typography variant="b1" style={style.tag}>
        Energy Balance
      </Typography>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 20,
      borderRadius: theme.radius.full,
      backgroundColor: 'transparent',
    },
    content: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 250,
      width: 250,
      borderRadius: theme.radius.full,
      backgroundColor: 'transparent',
      // borderWidth: 4,
      borderColor: theme.colors.black[300],
      paddingHorizontal: pixelSizeHorizontal(20),
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 20,
    },
    subTitle: {
      color: theme.colors.black[200],
      fontSize: theme.fontSize.m,
      fontFamily: theme.fonts.ManropeBold,
    },
    tag: {
      textAlign: 'center',
      fontWeight: '600',
      fontFamily:theme.fonts.ManropeSemibold,
      fontSize: fontPixel(theme.fontSize.l),
      color: theme.colors.white[100],
    },
    progressTitle: {
      textAlign: 'center',
      color: theme.colors.white[100],
      fontSize: fontPixel(theme.fontSize.xxxl),
    },
  });
};
