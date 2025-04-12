import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {
  ArrowBackIcon,
  BluetoothAudioIcon,
  Button,
  Typography,
} from '@/components/common';
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import PrintedCircuitBoardImage from '../../assets/images/inverter-removebg-preview.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackScreens} from '@/navigation/type';
import {useBluetoothContext} from '@/libs/context';
import {Spinner} from '@/components/common/loader/index.';

export const AddDeviceScreen: React.FunctionComponent = () => {
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

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreens>>();
  const navigateToDashboard = () => {
    navigation.goBack();
  };

  const handleDevicePairing = () => {
    if (discoveredDevice) {
      connectPeripheral({
        advertising: discoveredDevice?.advertising,
        id: discoveredDevice?.id,
        rssi: discoveredDevice?.rssi,
      }).then((response)=>{
        if (response) {
          navigation.goBack();
        }
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
    <View style={[style.innerContent, style.boxShadow]}>
      <Typography style={style.scanText}>
        {characteristics ? 'Connected' : 'Your Inverter Found'}
      </Typography>
      <Typography style={style.scanSubText}>(Click to connect)</Typography>
      <Image source={PrintedCircuitBoardImage} style={style.image} />
      <Typography variant='b2' style={style.bleText}>
        {isPairing ? 'Pairing...' : discoveredDevice.name}
      </Typography>
    </View>
  ) : (
    <View style={style.noDevice}>
      <Typography style={[style.scanText]}>
        No Device Found, Try again.{' '}
      </Typography>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity style={style.homeIcon} onPress={navigateToDashboard}>
          <ArrowBackIcon />
        </TouchableOpacity>
        <Typography>Bluetooth Connection</Typography>
        <View/>
      </View>
      <View style={style.bleIcon}>
        <BluetoothAudioIcon color={'white'} />
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!discoveredDevice}
        onPress={discoveredDevice && handleDevicePairing}
        style={[style.content, style.boxShadow]}>
        {isScanning ? (
          <Spinner loading title="Scanning please wait ." />
        ) : (
          bleView
        )}
      </TouchableOpacity>
      <Button
        style={style.button}
        textStyles={style.buttonText}
        onPress={handleBleConnect}
        variant="contained">
        {characteristics?.serviceId ? ' Disconnect' : 'Scan For  Device'}
      </Button>
    </View>
  );
};
const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(32),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
    },
    boxShadow: {
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 5.5,
      elevation: 4,
      shadowColor: theme.colors.black[100],
      backgroundColor: theme.colors.black[100],
    },
    content: {
      height: 315,
      width: 315,
      marginHorizontal: 'auto',
      marginTop: '25%',
      borderWidth: 4,
      borderStyle: 'dashed',
      borderRadius: theme.radius.full,
      borderColor: theme.colors.black[400],
    },
    innerContent: {
      height: 300,
      width: 300,
      margin: 'auto',
      borderRadius: theme.radius.full,
    },
    image: {
      height: 150,
      width: 150,
      margin: 'auto',
    },
    button: {
      width: '80%',
      marginHorizontal: 'auto',
      borderColor: theme.colors.orange[400],
      marginTop: '15%',
    },
    buttonText: {
      color: theme.colors.white[100],
    },
    bleText: {
      margin: 'auto',
      marginTop: '0%',
      marginBottom: '10%',
      fontWeight:'600',
      fontFamily:theme.fonts.ManropeSemibold
    },
    scanText: {
      marginTop: '10%',
      marginHorizontal: 'auto',
      marginBottom: '0%',
      color: theme.colors.white[100],
    },
    homeIcon: {
      marginTop: pixelSizeVertical(0),
    },
    bleIcon: {
      position: 'absolute',
      top: '40%',
      zIndex: 999,
      marginLeft: pixelSizeHorizontal(4),
    },
    connectButton: {
      marginTop: pixelSizeVertical(24),
    },
    noDevice: {
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      marginVertical: 'auto',
    },
    scanSubText: {
      textAlign: 'center',
      color: theme.colors.white[300],
      fontSize: fontPixel(14),
      fontWeight: '700',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
    },
  });
};
