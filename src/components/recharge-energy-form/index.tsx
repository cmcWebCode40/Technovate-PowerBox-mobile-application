import {View, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Button, Typography} from '../common';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeVertical} from '@/libs/utils';

interface RechargeEnergyFormProps {
  isLoading:boolean
  rechargeMeter: (unit: string) => void;
}

export const RechargeEnergyForm: React.FunctionComponent<
  RechargeEnergyFormProps
> = ({rechargeMeter, isLoading}) => {
  const style = useThemedStyles(styles);
  const [unit, setUnit] = useState<string | undefined>('1');
  const [amount, setAmount] = useState(100);

  const submit = () => {
    if (unit) {
      rechargeMeter(unit);
    }
  };

  const handleChange = (text: string) => {
    const eqUint = parseInt(text, 10) / 100;
    if (parseInt(text, 10)) {
      setAmount(parseInt(text, 10));
    }else{
      setAmount(100);
    }
    if (eqUint) {
      setUnit(String(eqUint));
    }else{
      setUnit('1');
    }
  };
  return (
    <View>
      <TextInput
        style={style.input}
        keyboardType="number-pad"
        placeholder="Enter Amount"
        editable={!isLoading}
        onChangeText={handleChange}
        placeholderTextColor={'#9095A1'}
      />
      <View style={style.conversionLayout}>
        <Typography>{Number(unit).toFixed(1)}</Typography>
        <Typography> = ₦{amount}</Typography>
      </View>
      <Button variant="filled" disabled={!unit || isLoading} loading={isLoading} onPress={submit}>
        Send
      </Button>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      padding: pixelSizeVertical(10),
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
