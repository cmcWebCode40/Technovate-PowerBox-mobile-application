/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {Typography, WireLessIcon} from '../common';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Theme, theme as themes} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {fontPixel, pixelSizeHorizontal} from '@/libs/utils';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';

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
  const animation = useRef<LottieView>(null);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        marginLeft: -40,
      }}>
      <Video
        source={require('../../../assets/powerbox-animation/powerBox_all_on.mp4')}
        style={style.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
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
      borderRadius: theme.radius.full,
      backgroundColor: 'transparent',
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
      fontFamily: theme.fonts.ManropeSemibold,
      fontSize: fontPixel(theme.fontSize.l),
      color: theme.colors.white[100],
    },
    progressTitle: {
      textAlign: 'center',
      color: theme.colors.white[100],
      fontSize: fontPixel(theme.fontSize.xxxl),
    },
    backgroundVideo: {
      width: Dimensions.get('window').width,
      height: 300,
    },
  });
};
