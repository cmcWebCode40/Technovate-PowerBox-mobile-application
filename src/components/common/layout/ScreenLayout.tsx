import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import React from 'react';
import {Theme} from '@/libs/config/theme';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {useThemedStyles} from '@/libs/hooks';

interface ScreenLayoutProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const ScreenLayout: React.FunctionComponent<ScreenLayoutProps> = ({
  style,
  children,
}) => {
  const baseStyle = useThemedStyles(styles);
  return <View style={[baseStyle.container, style]}>{children}</View>;
};

const styles = ({colors}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      ...Platform.select({
        ios:{
          paddingTop: '15%',
        },
        android:{
          paddingTop: '1%',
        },
      }),
      paddingBottom: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
    },
  });
};
