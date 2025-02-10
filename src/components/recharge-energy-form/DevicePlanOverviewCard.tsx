import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../common';
import { Theme } from '@/libs/config/theme';
import { useThemedStyles } from '@/libs/hooks';
import { pixelSizeVertical } from '@/libs/utils';

const DevicePlanOverviewCard: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const currentDate = new Date().toLocaleDateString();

  return (
    <View style={styles.cardContainer}>
      <Typography variant="h1" style={styles.title}>
        Wallet Overview
      </Typography>
      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Total Plan Package:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          N750,000
        </Typography>
      </View>
      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Balance:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          N400,000
        </Typography>
      </View>
      <View style={styles.infoRow}>
        <Typography variant="b1" style={styles.label}>
          Paid:
        </Typography>
        <Typography variant="b1" style={styles.value}>
          N350,000
        </Typography>
      </View>
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
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3, // Android shadow
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
