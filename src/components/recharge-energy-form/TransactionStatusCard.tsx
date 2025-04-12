import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  FailedIcon,
  PendingIcon,
  SuccessIcon,
  Typography,
} from '../common';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeVertical} from '@/libs/utils';
import {colors} from '@/libs/constants';

export interface TransactionStatusCardProps {
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  onViewDetails: () => void;
  unitLoaded: boolean;
}

const TransactionStatusCard: React.FC<TransactionStatusCardProps> = ({
  status,
  onViewDetails,
  unitLoaded,
}) => {
  const style = useThemedStyles(styles);

  return (
    <View style={style.cardContainer}>
      <View style={style.statusRow}>
        <View style={style.iconPlaceholder}>{getStatusIcon(status)}</View>
        <Typography
          variant="h2"
          style={[style.statusText, {color: getStatusColor(status)}]}>
          {status}
        </Typography>
      </View>

      {unitLoaded && <Typography>unit successfully loaded</Typography>}

      <Button
        onPress={onViewDetails}
        variant="text"
        style={style.detailsButton}>
        View Details
      </Button>
    </View>
  );
};

/**
 * Returns a color based on the transaction status.
 * You can adjust these values or reference theme colors if desired.
 */
const getStatusColor = (
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED',
): string => {
  switch (status) {
    case 'SUCCESSFUL':
      return colors.green[500]; // Green for successful
    case 'FAILED':
      return colors.red[200];
    case 'PENDING':
      return colors.yellow[100];
    default:
      return '#ffffff';
  }
};

const getStatusIcon = (
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED',
): React.ReactElement => {
  switch (status) {
    case 'SUCCESSFUL':
      return <SuccessIcon color={getStatusColor(status)} size={100} />;
    case 'FAILED':
      return <FailedIcon color={getStatusColor(status)} size={100} />;
    case 'PENDING':
      return <PendingIcon color={getStatusColor(status)} size={100} />;
    default:
      return <View />;
  }
};

export default TransactionStatusCard;

const styles = (theme: Theme) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.colors.black[200],
      borderRadius: theme.radius.lg,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: 16,
      marginVertical: pixelSizeVertical(8),
    },
    statusRow: {
      //   flexDirection: 'row',
      alignItems: 'center',
      marginBottom: pixelSizeVertical(12),
    },
    iconPlaceholder: {
      //   width: 32,
      //   height: 32,
      borderRadius: 16,
      //   backgroundColor: theme.colors.gray[500],
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    statusText: {
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeBold,
      fontSize: 18,
      marginTop: pixelSizeVertical(14),
      color: theme.colors.white[100], // default; will be overridden by getStatusColor
    },
    detailsButton: {
      marginTop: pixelSizeVertical(32),
    },
  });
