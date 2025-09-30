import {PermissionsAndroid, Platform} from 'react-native';

export const requestLocationPermissionsForAndroid = async () => {
  const checkResult = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (checkResult) {
    return;
  }

  const requestResult = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'We need access to your location to scan for Wi-Fi networks.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );

  return requestResult;
};


export const askForPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Number(Platform.Version) >= 33) {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External storage permission',
          message: 'App wants to access storage files',
          buttonPositive: 'access',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return;
    }
  }
  return true;
};

export const requestAndroidPermissionsForBluetooth = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  if (Platform.Version >= 31) {
    await requestBluetoothPermissionsForAndroid12Plus();
  } else if (Platform.Version >= 23) {
    await requestLocationPermissionsForAndroid();
  }
};

const requestBluetoothPermissionsForAndroid12Plus = async () => {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);
};

