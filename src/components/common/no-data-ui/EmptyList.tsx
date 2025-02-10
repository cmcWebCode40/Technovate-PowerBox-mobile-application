import {View, StyleSheet} from 'react-native';
import React from 'react';

import {Typography} from '../typography';
import { useThemedStyles } from '@/libs/hooks';
import { Theme } from '@/libs/config/theme';
import { heightPixel, pixelSizeVertical } from '@/libs/utils';
import { EmptyBoxIcon } from '../icons';

interface EmptyDataListProps {
  message?: string;
}

export const EmptyDataList: React.FunctionComponent<EmptyDataListProps> = ({
  message,
}) => {
  const style = useThemedStyles(styles);
  return (
    <View style={style.container}>
     <View>
        <EmptyBoxIcon size={80} />
     </View>
      <Typography style={style.text} variant="b1">
        {message ?? 'No data available yet. Check back soon.'}
      </Typography>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical:'50%',
    },
    image: {
      height: heightPixel(110),
    },
    text: {
      fontWeight: '600',
      textAlign:'center',
      marginTop: pixelSizeVertical(12),
      fontFamily: theme.fonts.ManropeSemibold,
    },
  });
};
