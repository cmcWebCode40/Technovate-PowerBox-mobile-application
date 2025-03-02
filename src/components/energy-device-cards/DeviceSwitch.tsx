import { colors } from '@/libs/constants';
import React, {useState} from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  View,
} from 'react-native';
import { Spinner } from '../common/loader/index.';
import { PowerSupplyIcon } from '../common';

interface DeviceSwitchProps {
  isLoading: boolean;
  color: string;
  disabled:boolean;
  onSwitch: () => void;
}

export const DeviceSwitch: React.FunctionComponent<DeviceSwitchProps> = ({ color, onSwitch, isLoading, disabled }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    onSwitch();
  };

  const animateStyle = {
    transform: [{ scale: scaleValue }],
    shadowColor: '#ffffff', // White shadow color for visibility on black background
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: scaleValue.interpolate({
      inputRange: [0.95, 1],
      outputRange: [0.25, 0.4], // Lower opacity for a softer shadow
    }),
    shadowRadius: scaleValue.interpolate({
      inputRange: [0.95, 1],
      outputRange: [8, 12], // Slightly increased blur radius for effect
    }),
    elevation: scaleValue.interpolate({
      inputRange: [0.95, 1],
      outputRange: [5, 12], // Higher elevation for more depth on Android
    }),
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        disabled={disabled || isLoading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        testID="power-supply-button"
      >
        <Animated.View style={[styles.switchContainer, animateStyle]}>
          {isLoading ? <Spinner loading /> : <PowerSupplyIcon color={color}  size={40} />}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    width: 85,
    height: 85,
    borderRadius: 999,
    backgroundColor: colors.white[100],
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});
