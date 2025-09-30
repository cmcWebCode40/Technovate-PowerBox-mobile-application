import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

interface DeviceBalanceIndicatorProps {
  value: string | number;
  currency?: string;
  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

const DeviceBalanceIndicator: React.FC<DeviceBalanceIndicatorProps> = ({
  value,
  currency = 'unit',
  position = { top: '20%', right: '25%' },
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <View style={[styles.container, position]}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          {formatValue(value)}{' '}{currency}
        </Text>
        <View style={styles.triangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  triangle: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
});

export default DeviceBalanceIndicator;
