import {View, TextInput, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {Button, Typography} from '../common';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {formatAmount, pixelSizeVertical} from '@/libs/utils';

interface RechargeEnergyFormProps {
  isLoading:boolean
  rechargeMeter: (unit: number) => void;
}

export const RechargeEnergyForm: React.FunctionComponent<
  RechargeEnergyFormProps
> = ({rechargeMeter, isLoading}) => {
  const style = useThemedStyles(styles);
  const [unit, setUnit] = useState<string | undefined>('100');
  const [amount, setAmount] = useState(100);
  const [calcAmount, setCalcAmount] = useState<string|undefined>(undefined);

  const submit = () => {
    if (!calcAmount) {
      Alert.alert('unit required');
      return;
    }
    rechargeMeter(Number(calcAmount));
  };

  const handleChange = (text: string) => {
    const eqUint = parseInt(text, 10) / 1;
    setCalcAmount(text);
    if (parseInt(text, 10)) {
      setAmount(parseInt(text, 10));
    }else{
      setAmount(100);
    }
    if (eqUint) {
      setUnit(String(eqUint));
    }else{
      setUnit('100');
    }
  };
  return (
    <View>
      <TextInput
        style={style.input}
        keyboardType="number-pad"
        placeholder="Enter Aunt"
        editable={!isLoading}
        value={calcAmount}
        maxLength={7}
        onChangeText={handleChange}
        placeholderTextColor={'#9095A1'}
      />
      <View style={style.conversionLayout}>
      <Typography> ₦{formatAmount(amount)} </Typography>
        <Typography>= {formatAmount(unit)}</Typography>
      </View>
      <Button variant="contained" disabled={!unit || isLoading} loading={isLoading} onPress={submit}>
        Proceed
      </Button>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      padding: pixelSizeVertical(14),
      backgroundColor: theme.colors.white[100],
      borderColor: theme.colors.gray[300],
      marginBottom: pixelSizeVertical(24),
      color: theme.colors.black[200],
    },
    conversionLayout: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: pixelSizeVertical(24),
    },
  });
};
