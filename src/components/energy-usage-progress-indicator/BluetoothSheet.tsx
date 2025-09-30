import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Theme} from '@/libs/config/theme';
import {
  ActionSheetHeader,
  actionSheetStyles,
  CloseIconPanel,
} from '../common/sheets';
import {useThemedStyles} from '@/libs/hooks';
import {BluetoothAudioIcon, Button, Typography} from '../common';
import {Spinner} from '../common/loader/index.';
import {useBluetoothContext} from '@/libs/context';
import PrintedCircuitBoardImage from '../../../assets/images/inverter.jpeg';
import { ScreenWeight } from '@/libs/utils';

export const BluetoothSheet = ({
  sheetId,
}: SheetProps<'bluetooth-connect-sheet'>) => {
  const style = useThemedStyles(styles);

  const {
    scanAvailableDevices,
    peripherals,
    isScanning,
    isPairing,
    disconnectPeripheral,
    connectPeripheral,
    characteristics,
  } = useBluetoothContext();
  const discoveredDevice = Array.from(peripherals.values())[0];

  const closeSheet = async () => {
    await SheetManager?.hide('bluetooth-connect-sheet');
  };

  const handleDevicePairing = () => {
    if (discoveredDevice) {
      connectPeripheral({
        advertising: discoveredDevice?.advertising,
        id: discoveredDevice?.id,
        rssi: discoveredDevice?.rssi,
      }).then(() => {
        closeSheet();
      });
    }
  };

  const handleBleConnect = () => {
    if (characteristics?.peripheralId) {
      disconnectPeripheral(characteristics.peripheralId);
      return;
    }
    scanAvailableDevices();
  };

  const bleView = discoveredDevice ? (
    <View style={style.deviceFoundContainer}>
      <View style={style.statusIndicator}>
        <View style={[style.statusDot, characteristics && style.connectedDot]} />
        <Typography variant="b2" style={style.statusText}>
          {characteristics ? 'Connected' : 'Found'}
        </Typography>
      </View>

      <View style={style.deviceImageContainer}>
        <Image source={PrintedCircuitBoardImage} style={style.image} />
        <View style={style.bluetoothIconOverlay}>
          <BluetoothAudioIcon size={20} color={style.bluetoothIconColor.color} />
        </View>
      </View>

      <View style={style.deviceInfo}>
        <Typography variant="b1" style={style.deviceName}>
          {isPairing ? 'Connecting...' : discoveredDevice.name}
        </Typography>
        <Typography variant="b2" style={style.deviceSubtext}>
          {characteristics ? 'Tap to disconnect' : 'Tap to connect'}
        </Typography>
      </View>

      {isPairing && (
        <View style={style.pairingIndicator}>
          <View style={style.pairingDots}>
            <View style={[style.dot, style.dot1]} />
            <View style={[style.dot, style.dot2]} />
            <View style={[style.dot, style.dot3]} />
          </View>
        </View>
      )}
    </View>
  ) : (
    <View style={style.noDeviceContainer}>
      <BluetoothAudioIcon size={48} color={style.noDeviceIcon.color} />
      <Typography variant="h1" style={style.noDeviceTitle}>
        No Device Found
      </Typography>
      <Typography variant="b2" style={style.noDeviceSubtext}>
        Make sure your inverter is nearby and in pairing mode
      </Typography>
    </View>
  );

  return (
    <View style={actionSheetStyles.sheetContainerWrapper}>
      <ActionSheet
        id={sheetId}
        isModal={true}
        closable={false}
        containerStyle={actionSheetStyles.containerStyle}
        indicatorStyle={actionSheetStyles.indicatorStyle}>
        <View style={style.sheetContent}>
          <CloseIconPanel onClose={closeSheet} />
          <ActionSheetHeader
            title="Bluetooth Connection"
            subTitle="Connect your device to monitor your inverter"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!discoveredDevice || isPairing}
            onPress={discoveredDevice && handleDevicePairing}
            style={[
              style.deviceContainer,
              characteristics && style.connectedDeviceContainer,
              (!discoveredDevice || isPairing) && style.disabledContainer,
            ]}>
            {isScanning ? (
              <View style={style.scanningContainer}>
                <Spinner loading />
                <Typography variant="b2" style={style.scanningText}>
                  Scanning for devices...
                </Typography>
              </View>
            ) : (
              bleView
            )}
          </TouchableOpacity>
          <Button
            style={[style.actionButton, characteristics && style.disconnectButton]}
            textStyles={style.buttonText}
            onPress={handleBleConnect}
            variant="contained"
            disabled={isScanning || isPairing}>
            {characteristics?.serviceId ? 'Disconnect Device' : 'Scan for Devices'}
          </Button>
        </View>
      </ActionSheet>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    sheetContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      // marginBottom: -36,
      backgroundColor: theme.colors.black[200],
    },

    // Device Container Styles
    deviceContainer: {
      minHeight: 280,
      marginHorizontal: 'auto',
      marginTop: 32,
      padding: 24,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.black[100],
      borderWidth: 2,
      borderColor: theme.colors.black[400],
      borderStyle: 'solid',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      shadowColor: theme.colors.black[100],
    },

    connectedDeviceContainer: {
      borderColor: theme.colors.green[400],
      backgroundColor: theme.colors.green[600],
    },

    disabledContainer: {
      opacity: 0.6,
    },

    // Device Found Container
    deviceFoundContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '80%',
    },

    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.black[400],
      borderRadius: theme.radius.full,
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.orange[400],
      marginRight: 8,
    },

    connectedDot: {
      backgroundColor: theme.colors.green[400],
    },

    statusText: {
      color: theme.colors.white[300],
      fontSize: 12,
      fontWeight: '600',
    },

    deviceImageContainer: {
      position: 'relative',
      marginVertical: 20,
    },

    image: {
      height: 120,
      width: 120,
      borderRadius: theme.radius.md,
    },

    bluetoothIconOverlay: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.blue[400],
      borderRadius: theme.radius.full,
      padding: 8,
      borderWidth: 2,
      borderColor: theme.colors.black[300],
    },

    bluetoothIconColor: {
      color: theme.colors.white[100],
    },

    deviceInfo: {
      alignItems: 'center',
      marginTop: 16,
      width: ScreenWeight - 100,
    },

    deviceName: {
      color: theme.colors.white[100],
      textAlign: 'center',
      marginBottom: 4,
      fontWeight: '700',
    },

    deviceSubtext: {
      color: theme.colors.white[100],
      textAlign: 'center',
      fontSize: 14,
    },

    // Pairing Animation
    pairingIndicator: {
      marginTop: 16,
    },

    pairingDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.orange[400],
      marginHorizontal: 3,
    },

    // Add animation classes if your theme supports them
    dot1: {
      // Animation delay: 0ms
    },
    dot2: {
      // Animation delay: 150ms
    },
    dot3: {
      // Animation delay: 300ms
    },

    // No Device Container
    noDeviceContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: 40,
    },

    noDeviceIcon: {
      color: theme.colors.white[300],
    },

    noDeviceTitle: {
      color: theme.colors.white[100],
      marginTop: 16,
      marginBottom: 8,
      fontWeight: '600',
    },

    noDeviceSubtext: {
      color: theme.colors.white[300],
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 20,
    },

    // Scanning Container
    scanningContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: 40,
      width: ScreenWeight - 100,
    },

    scanningText: {
      color: theme.colors.white[300],
      marginTop: 16,
      textAlign: 'center',
    },

    // Button Styles
    actionButton: {
      width: '100%',
      marginTop: 32,
      paddingVertical: 16,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.orange[400],
    },

    disconnectButton: {
      backgroundColor: theme.colors.red[200],
      borderColor: theme.colors.red[100],
    },

    buttonText: {
      color: theme.colors.white[100],
      fontWeight: '700',
      fontSize: 16,
    },
  });
};
