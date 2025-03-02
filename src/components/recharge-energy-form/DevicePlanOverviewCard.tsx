import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../common';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeVertical} from '@/libs/utils';
import {useAuthContext} from '@/libs/context';
import {NAIRA_SYMBOL} from '@/libs/constants';

interface DevicePlanOverviewCard {
  paidAmount?: string;
}

const DevicePlanOverviewCard: React.FC<DevicePlanOverviewCard> = ({
  paidAmount,
}) => {
  const styles = useThemedStyles(createStyles);
  const currentDate = new Date().toLocaleDateString();
  const {user} = useAuthContext();

  return (
    <View style={styles.cardContainer}>
      <Typography variant="h1" style={styles.title}>
        Plan Overview
      </Typography>
      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Total Plan Package:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          {NAIRA_SYMBOL} 0
        </Typography>
      </View>
      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Balance:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          {NAIRA_SYMBOL}
          {user?.planBalance}
        </Typography>
      </View>
      {paidAmount && (
        <View style={styles.infoRow}>
          <Typography variant="b1" style={styles.label}>
            Paid:
          </Typography>
          <Typography variant="b1" style={styles.value}>
            {NAIRA_SYMBOL} {paidAmount}
          </Typography>
        </View>
      )}

      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Date:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          {currentDate}
        </Typography>
      </View>
    </View>
  );
};

export default DevicePlanOverviewCard;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.colors.black[200],
      borderRadius: theme.radius.lg,
      padding: 16,
      marginVertical: pixelSizeVertical(8),
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontWeight: '700',
      color: theme.colors.white[100],
      fontFamily: theme.fonts.ManropeBold,
      fontSize: 22,
      marginBottom: pixelSizeVertical(16),
      textAlign: 'center',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: pixelSizeVertical(12),
    },
    label: {
      color: theme.colors.white[100],
      fontFamily: theme.fonts.ManropeBold,
      fontSize: 16,
    },
    value: {
      color: theme.colors.white[100],
      fontFamily: theme.fonts.ManropeRegular,
      fontSize: 16,
    },
  });
