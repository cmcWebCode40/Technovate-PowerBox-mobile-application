
import { colors } from '@/libs/constants';
import { useThemedStyles } from '@/libs/hooks';
import React from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  View,
  ModalProps as RNModalProps,
  ActivityIndicator,
} from 'react-native';

export interface BackDropProps
  extends Omit<RNModalProps, 'children | visible'> {
  isLoading: boolean;
}

export const BackDrop: React.FunctionComponent<BackDropProps> = ({
  isLoading,
  ...otherModalProps
}) => {
  const styles = useThemedStyles(baseStyles);

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      accessibilityHint="activity-indicator"
      visible={isLoading}
      {...otherModalProps}>
      <View style={styles.centeredView}>
        <ActivityIndicator
          accessibilityHint="activity-indicator"
          color={colors.blue[100]}
        />
      </View>
    </RNModal>
  );
};

const baseStyles = () => {
  return StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
  });
};
