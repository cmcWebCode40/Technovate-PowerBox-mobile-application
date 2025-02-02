import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  ActiveRadioIcon,
  Button,
  RadioIcon,
  Typography,
} from '@/components/common';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';

export const SubscriptionSelectionScreen: React.FunctionComponent = () => {
  const [selectedOption, setSelectedOption] = useState<'full' | 'installment'>(
    'full',
  );
  const style = useThemedStyles(styles);

  const handleProceed = () => {
    // Handle the proceed action here
    console.log('Proceeding with:', selectedOption);
  };

  return (
    <View style={style.container}>
      <Typography style={style.header}>Choose Payment Plan</Typography>

      <View style={style.optionsContainer}>
        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'full' && style.selectedOption,
          ]}
          onPress={() => setSelectedOption('full')}>
          <View>
            <Typography style={style.optionText}>Full Payment</Typography>
            <Typography style={style.optionSubText}>
              Pay the full amount upfront.
            </Typography>
          </View>
          <View>
            {selectedOption === 'full' ? <ActiveRadioIcon /> : <RadioIcon />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            style.option,
            selectedOption === 'installment' && style.selectedOption,
          ]}
          onPress={() => setSelectedOption('installment')}>
          <View>
            <Typography style={style.optionText}>
              Installment Payment
            </Typography>
            <Typography style={style.optionSubText}>
              Pay in monthly installments.
            </Typography>
          </View>
          <View>
            {selectedOption === 'installment' ? (
              <ActiveRadioIcon />
            ) : (
              <RadioIcon />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Button onPress={handleProceed}>Proceed</Button>
    </View>
  );
};

const styles = ({colors, spacing, radius, fontSize}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
    },
    header: {
      textAlign: 'center',
      fontSize: fontSize.xl,
      marginBottom: spacing.lg,
      color: colors.white[100],
    },
    optionsContainer: {
      marginBottom: spacing.xl,
    },
    option: {
      padding: spacing.m,
      borderRadius: radius.xl,
      borderWidth: 2,
      borderColor: colors.gray[300],
      marginBottom: spacing.xl,
      backgroundColor: colors.black[200],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedOption: {
      borderColor: colors.blue[100],
      // backgroundColor: colors.blue[100],
    },
    optionText: {
      fontSize: 18,
      color: colors.white[100],
    },
    optionSubText: {
      fontSize: 12,
      color: colors.gray[500],
      marginTop: pixelSizeVertical(12),
    },
    proceedButton: {
      backgroundColor: colors.blue[100],
      padding: spacing.m,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    proceedButtonText: {
      color: colors.white[100],
      fontSize: 18,
    },
  });
};
