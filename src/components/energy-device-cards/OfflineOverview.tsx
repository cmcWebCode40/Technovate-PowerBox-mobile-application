import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {BluetoothAudioIcon, Typography} from '../common';
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {colors} from '@/libs/constants';

interface OfflineOverviewProps {
  socketNo?: string;
  isConnected?: boolean;
}

export const OfflineOverview: React.FunctionComponent<OfflineOverviewProps> = ({
  socketNo,
  isConnected = false,
}) => {
  const {green} = colors;

  const mainStyle = useThemedStyles(styles);

  return (
    <TouchableOpacity activeOpacity={0.8} style={mainStyle.container}>
      <View style={mainStyle.cardHeader}>
        <View style={mainStyle.subHeader}>
          <BluetoothAudioIcon
            color={isConnected ? colors.green[500] : colors.red[200]}
          />
          <View>
            <Typography style={mainStyle.headerTitle}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </View>
        </View>
        <View style={[mainStyle.status, {backgroundColor: green[700]}]}>
          <Typography style={[mainStyle.statusText, {color: green[600]}]}>
            {socketNo}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: pixelSizeHorizontal(16),
      marginTop: pixelSizeVertical(8),
    },
    btnFooter: {
      width: '50%',
    },
    btnSpaceRight: {},
    btnSpaceLeft: {
      marginLeft: pixelSizeHorizontal(4),
      borderRadius: theme.radius.lg,
    },
    container: {
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 10,
      shadowRadius: 6.65,
      elevation: 4,
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      shadowColor: theme.colors.black[100],
      backgroundColor: theme.colors.black[200],
      paddingVertical: pixelSizeVertical(16),
      marginBottom: pixelSizeVertical(24),
    },
    headerTitle: {
      fontSize: fontPixel(16),
      textTransform: 'capitalize',
      marginLeft: 4,
      marginTop: -10,
      fontFamily: theme.fonts.ManropeBold,
    },
    status: {
      borderRadius: theme.radius.xxl,
      paddingVertical: pixelSizeVertical(8),
      paddingHorizontal: pixelSizeHorizontal(8),
      marginTop: '2%',
      marginRight: pixelSizeHorizontal(8),
    },
    statusText: {
      fontWeight: '700',
      textTransform: 'uppercase',
      fontSize: fontPixel(theme.fontSize.s),
    },
    subHeader: {
      flexDirection: 'row',
      marginTop: 10,
      alignItems: 'center',
    },
    caption: {
      color: theme.colors.blue[200],
      fontSize: fontPixel(24),
      fontWeight: '600',
      fontFamily: theme.fonts.ManropeSemibold,
    },
    cardHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: pixelSizeVertical(24),
      paddingHorizontal: pixelSizeHorizontal(10),
    },
    powerRating: {
      fontSize: fontPixel(theme.fontSize.m),
    },
    btn: {
      flexBasis: '60%',
    },
    title: {
      fontSize: fontPixel(20),
      marginVertical: pixelSizeVertical(8),
      color: theme.colors.blue[200],
      marginRight: pixelSizeHorizontal(10),
    },
    deviceId: {
      fontSize: fontPixel(theme.fontSize.s),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: pixelSizeVertical(12),
      marginTop: 20,
    },
  });
};
