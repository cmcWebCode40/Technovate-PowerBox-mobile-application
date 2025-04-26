import React from 'react';
import {Image, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Typography} from '@/components/common';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  fontPixel,
  HAS_VIEWED_WELCOME_SCREEN,
  pixelSizeHorizontal,
  pixelSizeVertical,
  saveToAsyncStore,
} from '@/libs/utils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AuthStackScreens} from '@/navigation/type';

import AppLogo from '../../assets/images/power_box_logo.webp';
const BackgroundImage = require('../../assets/images/Solar-energy-and-sustainable-urban-developments.jpg');

export const WelcomeScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreens>>();

  const handleGetStarted = () => {
    savedOnboardingStatus();
    navigation.navigate('SignUp');
  };

  const savedOnboardingStatus = async ()=>{
    await saveToAsyncStore(HAS_VIEWED_WELCOME_SCREEN, 'true');
  };



  return (
    <ImageBackground source={BackgroundImage} style={style.backgroundImage}>
      <View style={style.overlay}>
      <View style={style.header}>
        <Image source={AppLogo} />
      </View>
        <Typography variant="h1" style={style.title}>
          Welcome to Power Box
        </Typography>

        <Typography variant="b1" style={style.description}>
          Your ultimate solution for managing power and energy efficiently.
        </Typography>

        <Button
          onPress={handleGetStarted}
          style={style.button}
          variant="contained">
          Get Started
        </Button>
        <TouchableOpacity onPress={() => {
            savedOnboardingStatus();
            navigation.navigate('SignIn');}}>
          <Typography variant="b1" style={style.signInText}>
            Already have an account?{' '}
            <Typography variant="b1" style={style.signInLink}>
              Sign In
            </Typography>
          </Typography>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = ({colors, fontSize, fonts}: Theme) => {
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingVertical: pixelSizeVertical(16),
        paddingHorizontal: pixelSizeHorizontal(16),
        backgroundColor: colors.black[100],
        justifyContent: 'center',
      },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: pixelSizeHorizontal(16),
      paddingVertical: pixelSizeVertical(24),
    },
    title: {
      fontSize: fontPixel(fontSize.xxl),
      fontFamily: fonts.ManropeBold,
      fontWeight: '700',
      color: colors.white[100],
      textAlign: 'center',
      marginBottom: pixelSizeVertical(16),
    },
    description: {
      fontSize: fontPixel(fontSize.l),
      fontFamily: fonts.ManropeSemibold,
      color: colors.white[100],
      textAlign: 'center',
      fontWeight:'600',
      marginBottom: pixelSizeVertical(40),
      paddingHorizontal: pixelSizeHorizontal(24),
    },
    button: {
      width: '100%',
      marginBottom: pixelSizeVertical(24),
    },
    signInText: {
      textAlign: 'center',
      color: colors.gray[200],
    },
    signInLink: {
      color: colors.blue[100],
      textDecorationLine: 'underline',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: pixelSizeVertical(24),
      },
  });
};
