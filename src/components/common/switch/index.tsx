import {theme} from '@/libs/config/theme';
import React from 'react';
import {StyleProp, StyleSheet, Switch, ViewStyle} from 'react-native';

interface SwitchIconProps {
  style?: StyleProp<ViewStyle>;
  isEnabled?: boolean;
  onChange?: (state: boolean) => void;
}

export const SwitchIcon: React.FunctionComponent<SwitchIconProps> = ({
  style,
  isEnabled,
  onChange,
}) => {
  const {
    colors: {green, gray, white},
  } = theme;

  return (
    <Switch
      trackColor={{false: gray[200], true: green[300]}}
      thumbColor={isEnabled ? white[100] : white[100]}
      ios_backgroundColor={gray[200]}
      onValueChange={onChange}
      value={isEnabled}
      style={[styles.switch, style]}

    />
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
