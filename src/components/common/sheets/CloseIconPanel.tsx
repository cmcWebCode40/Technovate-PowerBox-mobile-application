import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import { CloseIcon } from '../icons';
import { createHitSlop } from '@/libs/utils';
import { useThemedStyles } from '@/libs/hooks';

interface CloseIconPanelProps {
  onClose: () => void;
}

export const CloseIconPanel: React.FunctionComponent<CloseIconPanelProps> = ({
  onClose,
}) => {
  const style = useThemedStyles(styles);
  return (
    <View style={style.container}>
      <View />
      <TouchableOpacity
        hitSlop={createHitSlop(20)}
        onPress={onClose}
        testID="close-button">
        <CloseIcon size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
};
