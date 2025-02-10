import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {ChevronRightIcon, Typography} from '@/components/common';
import { useThemedStyles } from '@/libs/hooks';
import { colors } from '@/libs/constants';
import { Theme } from '@/libs/config/theme';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical } from '@/libs/utils';


interface SettingCardProps {
  image: React.ReactNode;
  title: string;
  screen: string;
  onPress: (screen: string) => void;
}

export const SettingCard: React.FunctionComponent<SettingCardProps> = ({
  image,
  title,
  screen,
  onPress,
}) => {
  const style = useThemedStyles(styles);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(screen)}
      style={style.container}>
      <View style={style.content}>
        {image}
        <Typography variant="b1" style={style.title}>
          {title}
        </Typography>
      </View>
      <ChevronRightIcon size={'22'} color={colors.gray[200]} />
    </TouchableOpacity>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: theme.colors.gray[600],
      paddingHorizontal: pixelSizeHorizontal(32),
      paddingVertical: pixelSizeVertical(24),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      marginLeft: pixelSizeHorizontal(16),
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeSemibold,
      color: theme.colors.gray[200],
      lineHeight: heightPixel(20),
    },
  });
};
