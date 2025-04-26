import { colors } from '@/libs/constants';
import React, {useState} from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Spinner } from '../common/loader/index.';
import { PowerSupplyIcon } from '../common';

interface DeviceSwitchProps {
  isLoading: boolean;
  color: string;
  onSwitch: () => void;
}

export const DeviceSwitch: React.FunctionComponent<DeviceSwitchProps> = ({ color, onSwitch, isLoading }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onSwitch();
  };

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animateStyle = {
    transform: [{ scale: scaleValue }],
    shadowColor: colors.black[300],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: scaleValue.interpolate({
      inputRange: [0.95, 1.5],
      outputRange: [0.55, 0.9]
    }),
    shadowRadius: scaleValue.interpolate({
      inputRange: [0.95, 1.5],
      outputRange: [10, 16], 
    }),
    elevation: scaleValue.interpolate({
      inputRange: [0.95, 1.5],
      outputRange: [7, 16],
    }),
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
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
    backgroundColor: colors.black[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:3,
    borderColor:colors.black[300],
    shadowColor: colors.black[100],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
});
