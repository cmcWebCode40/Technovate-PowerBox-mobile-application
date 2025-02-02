import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {Typography} from '@/components/common';

type TransactionItemProps = {
  date: string;
  transRef: string;
  amount: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  date,
  transRef,
  amount,
  status,
}) => {
  const style = useThemedStyles(styles);

  // Determine status color
  const statusColor =
    status === 'SUCCESSFUL'
      ? style.successText
      : status === 'FAILED'
      ? style.failedText
      : style.pendingText;

  return (
    <TouchableOpacity style={style.container}>
      <View style={style.row}>
        <Typography style={style.label}>Date:</Typography>
        <Typography style={style.value}>{date}</Typography>
      </View>
      <View style={style.row}>
        <Typography style={style.label}>TransRef:</Typography>
        <Typography style={style.value}>{transRef}</Typography>
      </View>
      <View style={style.row}>
        <Typography style={style.label}>Amount:</Typography>
        <Typography style={style.value}>{amount}</Typography>
      </View>
      <View style={style.row}>
        <Typography style={style.label}>Status:</Typography>
        <Typography style={[style.value, statusColor]}>{status}</Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = ({colors, spacing, radius, fonts}: Theme) => {
  return StyleSheet.create({
    container: {
      padding: spacing.m,
      borderRadius: radius.md,
      backgroundColor: colors.black[200],
      marginBottom: spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 14,
      color: colors.gray[500],
      fontFamily: fonts.ManropeBold,
      fontWeight: '600',
    },
    value: {
      fontSize: 14,
      color: colors.gray[500],
      fontFamily: fonts.ManropeBold,
      fontWeight: '600',
    },
    successText: {
      color: colors.green[200],
    },
    failedText: {
      color: colors.red[200],
    },
    pendingText: {
      color: colors.yellow[100],
    },
  });
};
