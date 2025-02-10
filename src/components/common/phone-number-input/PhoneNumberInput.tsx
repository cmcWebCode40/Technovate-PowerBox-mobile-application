import {
  View,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  Image,
} from 'react-native';
import React from 'react';
import {Typography} from '../typography';

import NGFlagImage from '../../../../assets/images/flag.png';
import { useThemedStyles } from '@/libs/hooks';
import { TextField } from '../form-group';
import { Theme } from '@/libs/config/theme';
import { fontPixel, pixelSizeHorizontal, pixelSizeVertical } from '@/libs/utils';

interface PhoneNumberInputProps extends TextInputProps {
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  errorMessage?: string;
}

export const PhoneNumberInput: React.FunctionComponent<
  PhoneNumberInputProps
> = ({label, errorMessage, labelStyle, inputStyle, ...otherTextInputProps}) => {
  const style = useThemedStyles(styles);

  return (
    <View>
      {label && (
        <Typography variant="b1" style={[style.label, labelStyle]}>
          {label}
        </Typography>
      )}
      <View style={[style.inputContainer, inputStyle]}>
        <View style={style.iconContainer}>
          <View style={style.flagIcon}>
            <Image source={NGFlagImage} />
          </View>
        </View>
        <TextField style={[style.input, inputStyle]} {...otherTextInputProps} />
      </View>
      {errorMessage && (
        <Typography style={style.error} variant="b2">
          {errorMessage}
        </Typography>
      )}
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      flexBasis: '18%',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.radius.lg,
      paddingVertical: pixelSizeVertical(18),
      paddingHorizontal: pixelSizeHorizontal(10),
      backgroundColor: theme.colors.black[200],
      marginRight: pixelSizeHorizontal(8),
    },
    input: {
      flexBasis: '80%',
      fontSize: fontPixel(theme.fontSize.l),
      color: theme.colors.white[100],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.black[200],
    },
    label: {
      marginBottom: pixelSizeVertical(10),
      fontWeight: '600',
      fontSize: fontPixel(theme.fontSize.l),
      textTransform: 'capitalize',
      color: theme.colors.black[300],
      fontFamily: theme.fonts.ManropeSemibold,
    },
    error: {
      color: theme.colors.red[200],
      marginTop: 4,
    },
    flagIcon: {
      marginLeft: '30%',
    },
  });
};
