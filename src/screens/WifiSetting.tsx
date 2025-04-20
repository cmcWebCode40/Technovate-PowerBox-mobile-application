import {
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Theme} from '@/libs/config/theme';
import {Header} from '@/components/common/header';
import {Button, Typography} from '@/components/common';
import {FormGroup} from '@/components/common/form-group';
import {Select} from '@/components/common/select/index.';
import WifiManager from 'react-native-wifi-reborn';
import OpenSettings from 'react-native-android-open-settings';
import {showMessage} from 'react-native-flash-message';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAuthContext, useBluetoothContext} from '@/libs/context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {useNavigation} from '@react-navigation/native';
import { ScreenLayout } from '@/components/common/layout';

type WifiConfig = {
  ssid?: string;
  password?: string;
};

export const WifiSchema = Yup.object().shape({
  name: Yup.string().required('Wifi is required!').trim().optional(),
  password: Yup.string().required('Password is required!').trim(),
});

const formInitialValues = {
  name: '',
  password: '',
};

export const WifiSettingScreen: React.FunctionComponent = () => {
  const [wifiCredentials, setWifiCredentials] = useState<WifiConfig>({
    ssid: undefined,
  });
  const [wifiNetworks, setWifiNetworks] = useState<
    {label: string; value: string}[]
  >([]);
  const [wifiSelection, setWifiSelection] = useState<
    'AUTOMATICALLY' | 'MANUALLY' | undefined
  >(undefined);
  const style = useThemedStyles(styles);

  const {setupWifi, loadingState} = useBluetoothContext();
  const {user} = useAuthContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  useEffect(() => {
    getWifiList();
  }, []);

  const getWifiList = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'We need access to your location to scan for Wi-Fi networks.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const wifiList = await WifiManager.loadWifiList();
          const seenSSIDs = new Set();
          const data = wifiList
            .filter(item => {
              const cleanSSID = item.SSID.replace(/^"(.*)"$/, '$1');
              if (seenSSIDs.has(cleanSSID)) {
                return false;
              }
              seenSSIDs.add(cleanSSID);
              return true;
            })
            .map(item => ({
              label: item.SSID.replace(/^"(.*)"$/, '$1'),
              value: item.SSID,
            }));
          setWifiNetworks(data);
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(
              error.message,
              'Enable Location in Settings for Wi-Fi access.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Proceed',
                  onPress: () => OpenSettings.locationSourceSettings(),
                  style: 'default',
                },
              ],
              {cancelable: true},
            );
          }
        }
      } else {
        console.log('Location permission denied');
      }
    } else {
      Alert.alert(
        'Not Supported',
        'Wi-Fi scanning is supported only on Android.',
      );
    }
  };

  function validatePassword(password: string) {
    const MIN_LENGTH = 8; // WPA2 minimum
    const MAX_LENGTH = 63; // WPA2 maximum
    return password.length >= MIN_LENGTH && password.length <= MAX_LENGTH;
  }

  const handleLogin = async (payload: typeof formInitialValues) => {
    if (payload.password) {
      if (!validatePassword(payload.password)) {
        showMessage({
          type: 'danger',
          message: 'Password must be 8-63 characters',
        });
        return;
      }
    }
    if (!user?.powerBoxId) {
      Alert.alert('No Device ID');
      return;
    }
    const wifiName = wifiCredentials.ssid ?? payload.name;
    await setupWifi(
      wifiName.trimEnd(),
      payload.password.trimEnd(),
      user?.powerBoxId,
    );
    showMessage({
      message:
        'WIFI Configuration Request Successfully Sent. Your device will restart shortly.',
      type: 'success',
      duration: 5000,
    });
    navigation.goBack();
  };

  return (
    <ScreenLayout style={style.container}>
      <Header showHomeIcon title="Wifi Settings" />
      <View style={style.content}>
        <View>
          <Select
            data={[
              {
                label: 'AUTOMATICALLY',
                value: 'AUTOMATICALLY',
              },
              {
                label: 'MANUALLY',
                value: 'MANUALLY',
              },
            ]}
            label="Choose WIFI Selection Type"
            onSelect={(value: any) => {
              setWifiCredentials({ssid: undefined});
              setWifiSelection(value);
            }}
          />
          {wifiSelection === 'AUTOMATICALLY' && (
            <Select
              search={true}
              data={wifiNetworks}
              label="LIST OF AVAILABLE WIFI"
              placeholder="Select WIFI"
              defaultValue={wifiCredentials.ssid}
              onSelect={value => setWifiCredentials({ssid: value})}
            />
          )}
          <Formik
            enableReinitialize={true}
            initialValues={formInitialValues}
            onSubmit={handleLogin}
            validationSchema={WifiSchema}>
            {({
              values,
              errors,
              isValid,
              handleChange,
              setFieldTouched,
              handleSubmit,
            }) => (
              <>
                <View style={style.space}>
                  {wifiSelection === 'MANUALLY' && (
                    <FormGroup
                      onChangeText={handleChange('name')}
                      onBlur={() => setFieldTouched('name')}
                      value={values.name}
                      editable={!loadingState.isConnectingWifi}
                      errorMessage={errors.name}
                      placeholder="Enter Wifi Name"
                    />
                  )}
                </View>
                <View>
                  <FormGroup
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    value={values.password}
                    editable={!loadingState.isConnectingWifi}
                    errorMessage={errors.password}
                    placeholder="Enter password"
                    usePassword={true}
                  />
                </View>
                <View style={style.note}>
                  <Typography style={style.noteText}>
                    IMPORTANT: Setting up Wi-Fi requires restarting your
                    inverter. After restart, please reconnect via Bluetooth to
                    continue using offline mode.
                  </Typography>
                </View>
                <Button
                  size="sm"
                  disabled={!isValid || loadingState.isConnectingWifi}
                  onPress={() => {
                    handleSubmit();
                  }}
                  style={style.button}
                  loading={loadingState.isConnectingWifi}
                  variant="contained">
                  SET WIFI CREDENTIALS
                </Button>
              </>
            )}
          </Formik>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = ({colors, fonts}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
    },
    note: {
      marginVertical: 16,
    },
    noteText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: fonts.ManropeSemibold,
    },
    header: {
      textAlign: 'center',
    },
    content: {
      //   paddingVertical: pixelSizeVertical(16),
    },
    action: {
      paddingHorizontal: 12,
      // marginBottom:16
    },
    button: {
      marginTop: pixelSizeVertical(40),
      backgroundColor: colors.blue[300],
    },
    space: {
      marginBottom: pixelSizeVertical(24),
    },
  });
};
