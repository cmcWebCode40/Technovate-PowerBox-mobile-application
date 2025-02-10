import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Typography } from '../common';
import { Theme } from '@/libs/config/theme';
import { useThemedStyles } from '@/libs/hooks';
import { pixelSizeVertical } from '@/libs/utils';

interface RechargePreviewCardProps {
  deviceId?: string;
  unitAmount?: number | string;
  customerName?: string;
  email?: string;
  date?: string;
  convenienceFee?: number | string;
  pay:()=>void
  isLoading:boolean
}


const RechargePreviewCard: React.FC<RechargePreviewCardProps> = ({
  deviceId,
  unitAmount,
  customerName,
  email,
  date,
  pay,
  isLoading,
  convenienceFee,
}) => {
  const style = useThemedStyles(styles);

  const renderRow = (label: string, value?: string | number) => (
    <View style={style.row} key={label}>
      <Typography variant="b1" style={style.label}>{label}</Typography>
      <Typography variant="b1" style={style.value}>{value}</Typography>
    </View>
  );

  return (
    <View style={style.cardContainer}>
      {renderRow('Device ID:', deviceId)}
      {renderRow('Unit Amount:', unitAmount)}
      {renderRow('Customer Name:', customerName)}
      {renderRow('Email:', email)}
      {renderRow('Date:', date)}
      {renderRow('Convenince Fee:', convenienceFee)}
      <Button loading={isLoading} onPress={pay} style={style.btn}>
        Pay
      </Button>
    </View>
  );
};

export default RechargePreviewCard;

const styles = (theme: Theme) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.colors.black[200],
      borderRadius: theme.radius.lg,
      paddingVertical: pixelSizeVertical(16),
      marginVertical: pixelSizeVertical(8),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: pixelSizeVertical(8),
      borderBottomWidth:0.5,
      borderBottomColor:theme.colors.gray[500],
      paddingVertical:pixelSizeVertical(10),
    },
    label: {
      fontWeight: '600',
      color: theme.colors.white[100],
      fontFamily:theme.fonts.ManropeBold,
    },
    value: {
        color: theme.colors.white[100],
        width: 'auto',
        flexWrap: 'wrap',
    },
    btn:{
      marginVertical: 12,
    },
  });
