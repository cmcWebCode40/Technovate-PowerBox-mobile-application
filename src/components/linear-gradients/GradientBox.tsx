import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import { heightPixel } from '@/libs/utils';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBoxProps {
  colors: string[];
  children: React.ReactNode;
}

export const GradientBox: React.FunctionComponent<GradientBoxProps> = ({
  colors,
  children,
}) => {
  const style = useThemedStyles(styles);
  return (
    <LinearGradient colors={colors} style={style.gradientBorder}>
      <View style={style.boxContent}>
        <Text>{children}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    gradientBorder: {
      padding: 3,
      borderRadius: 10,
      overflow: 'hidden',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.8,
      shadowRadius: 5.5,
      elevation: 4,
      shadowColor: theme.colors.gray[100],
    },
    boxContent: {
      padding: 20,
      borderRadius: 10,
      flex:1,
      height:heightPixel(150),
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: theme.colors.black[100],
    },
  });
};
