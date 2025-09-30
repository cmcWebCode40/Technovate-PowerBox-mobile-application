import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import {Typography} from '../typography';
import { useThemedStyles } from '@/libs/hooks';
import { Theme } from '@/libs/config/theme';

interface ActionSheetHeaderProps {
  title: string;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
}
export const ActionSheetHeader: React.FunctionComponent<
  ActionSheetHeaderProps
> = ({title, style, subTitle}) => {
  const mainStyle = useThemedStyles(styles);
  return (
    <View style={[mainStyle.container, style]}>
      <Typography variant="b1" style={mainStyle.title}>
        {title}
      </Typography>
      <Typography variant="b2" style={mainStyle.subTitle}>
        {subTitle}
      </Typography>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      marginTop: (32),
    },
    title: {
      fontWeight: '600',
      fontSize: (theme.fontSize.xl),
      lineHeight: (24),
      color: theme.colors.gray[200],
      marginBottom: (8),
      fontFamily: theme.fonts.ManropeRegular,
    },
    subTitle: {
      lineHeight: (16),
      color: theme.colors.gray[100],
    },
  });
};
