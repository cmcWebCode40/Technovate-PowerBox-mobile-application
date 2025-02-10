import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  ActiveRadioIcon,
  Button,
  RadioIcon,
  Typography,
} from '@/components/common';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {TextField} from '@/components/common/form-group';

export const LinkAccountScreen: React.FunctionComponent = () => {
  const [selectedOption, setSelectedOption] = useState<'id' | 'qr'>('id');
  const [idInput, setIdInput] = useState('');
  const style = useThemedStyles(styles);

  const handleProceed = () => {
    if (selectedOption === 'id' && !idInput.trim()) {
      Alert.alert('Error', 'Please enter a valid ID.');
      return;
    }
    if (selectedOption === 'id') {
      console.log('Proceeding with ID:', idInput);
    } else {
      console.log('Proceeding with QR code scan');
    }
  };

  return (
    <View style={style.container}>
      <Typography style={style.header}>
        Link Your Account to Power Box
      </Typography>
      <View style={style.optionsContainer}>
        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'id' && style.selectedOption,
          ]}
          onPress={() => setSelectedOption('id')}>
          <View style={style.inputContainer}>
            <Typography style={style.optionText}>
              By typing the ID directly
            </Typography>
            {selectedOption === 'id' && (
              <TextField
                placeholder="Enter Power Box ID"
                value={idInput}
                onChangeText={setIdInput}
                style={style.inputField}
              />
            )}
          </View>
          <View>
            {selectedOption === 'id' ? <ActiveRadioIcon /> : <RadioIcon />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'qr' && style.selectedOption,
          ]}
          onPress={() => setSelectedOption('qr')}>
          <View>
            <Typography style={style.optionText}>Via QR code scan</Typography>
            {selectedOption === 'qr' && (
              <Typography style={style.optionSubText}>
                Scan the QR code on your Power Box.
              </Typography>
            )}
          </View>
          <View>
            {selectedOption === 'qr' ? <ActiveRadioIcon /> : <RadioIcon />}
          </View>
        </TouchableOpacity>
      </View>
      <Button variant="contained" onPress={handleProceed}>
        Proceed
      </Button>
    </View>
  );
};

const styles = ({colors, spacing, radius}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
    },
    header: {
      textAlign: 'center',
      marginBottom: spacing.lg,
      color: colors.white[100],
    },
    optionsContainer: {
      marginBottom: spacing.xl,
    },
    option: {
      padding: spacing.m,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.gray[600],
      marginBottom: spacing.xl,
      backgroundColor: colors.black[200],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedOption: {
      borderColor: colors.blue[200],
      // backgroundColor: colors.blue[200],
    },
    optionText: {
      fontSize: 18,
      color: colors.white[100],
      marginBottom: spacing.sm,
    },
    optionSubText: {
      fontSize: 14,
      color: colors.white[300],
    },
    inputField: {
      marginTop: spacing.sm,
      color: colors.black[100],
      backgroundColor: colors.gray[100],
    },
    inputContainer: {
      flexBasis: '75%',
    },
  });
};
