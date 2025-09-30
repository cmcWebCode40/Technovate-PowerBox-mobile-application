import { colors } from '@/libs/constants';
import {StyleSheet} from 'react-native';

export const actionSheetStyles = StyleSheet.create({
  containerStyle: {
    // height: 'auto',
    borderTopLeftRadius: (24),
    borderTopRightRadius: (24),
  },
  indicatorStyle: {
    width: 0,
  },
  sheetContainerWrapper:{
    width: '100%', height: '100%', position: 'absolute',
  },
});
