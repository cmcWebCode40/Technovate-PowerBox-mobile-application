import React, {createContext, useContext, useEffect, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {byteToString} from '../utils/binaryFormatters';
import BleManager, {
  BleManagerDidUpdateValueForCharacteristicEvent,
  Peripheral,
} from 'react-native-ble-manager';
import {
  Alert,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {DeviceRealTimeInfo} from '../mqtt/types';
import {defaultDeviceInfo} from './MqttContext';
import {TextEncoder} from 'text-encoding';

const DEVICE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const TRANSFER_CHARACTERISTIC_UUID = 'beb5483f-36e1-4688-b7f5-ea07361b26a9';
const RECEIVE_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const METER_READING_CHARACTERISTIC_UUID =
  'beb5483e-36e2-4688-b7f5-ea07361b26a8';

type LoadingState = {
  isRecharging: boolean;
  isToggling: boolean;
  isUpsLoading: boolean;
  isConnectingWifi: boolean;
};

type DefaultContext = {
  stopScan: () => void;
  isPairing: boolean;
  isScanning: boolean;
  loadLimit?: string;
  loadingState: LoadingState;
  addLoadLimit: (limit: string) => void;
  scanAvailableDevices: () => void;
  energyMetric: DeviceRealTimeInfo;
  peripherals: Map<string, Peripheral>;
  characteristics?: PeripheralServices;
  connectPeripheral: (peripheral: Peripheral) => Promise<boolean>;
  devicePowerControl: (deviceId: string) => void;
  topUp: (deviceId: string, reference: string, amount: string) => void;
  disconnectPeripheral: (peripheralId: string) => void;
  setupWifi: (
    ssid: string,
    password: string,
    deviceId: string,
  ) => Promise<void>;
  read: (
    service: string,
    peripheral: string,
    characteristic: string,
  ) => Promise<number[]>;
  write: (data: any, services: PeripheralServices) => Promise<void>;
};

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const defaultLoadingState = {
  isRecharging: false,
  isToggling: false,
  isUpsLoading: false,
  isConnectingWifi: false,
};

type PeripheralServices = {
  peripheralId: string;
  serviceId: string;
  transfer: string;
  receive: string;
  meterInfoReading?: string;
};

type BluetoothContextProvider = {
  children: React.ReactNode;
};

export type BleResponse = {
  type:
    | 'setConnectionPriority '
    | 'wifiConfig'
    | 'control'
    | 'meter on'
    | 'meter off'
    | 'wallet';
  msg: string;
  id: string;
};

export const BluetoothContext = createContext<DefaultContext>({
  read: async () => [],
  write: async () => undefined,
  stopScan: () => undefined,
  isPairing: false,
  isScanning: false,
  energyMetric: defaultDeviceInfo,
  loadLimit: undefined,
  loadingState: defaultLoadingState,
  addLoadLimit: () => undefined,
  peripherals: new Map<Peripheral['id'], Peripheral>(),
  characteristics: undefined,
  devicePowerControl: () => undefined,
  topUp: () => undefined,
  connectPeripheral: async () => false,
  disconnectPeripheral: () => undefined,
  scanAvailableDevices: () => undefined,
  setupWifi: async () => undefined,
});

export const BluetoothContextProvider: React.FunctionComponent<
  BluetoothContextProvider
> = ({children}) => {
  //  From thing speak API
  const [energyMetric, setEnergyMetric] =
    useState<DeviceRealTimeInfo>(defaultDeviceInfo);
  const [isScanning, setIsScanning] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [loadLimit, setLoadLimit] = useState<undefined | string>('10');
  const [characteristics, setCharacteristics] = useState<
    PeripheralServices | undefined
  >(undefined);
  const [loadingState, setLoadingState] = useState(defaultLoadingState);

  const addLoadLimit = (value: string) => {
    setLoadLimit(value);
  };

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const handleUpdateValueForCharacteristic = async (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    const response = await read(
      data.service,
      data.peripheral,
      data.characteristic,
    );
    if (data.characteristic === METER_READING_CHARACTERISTIC_UUID) {
      const readings = JSON.parse(byteToString(response)) as DeviceRealTimeInfo;
      console.log(readings, 'DATA');

      setEnergyMetric(prevReadings => ({...prevReadings, ...readings}));
    }

    if (data.characteristic === RECEIVE_CHARACTERISTIC_UUID) {
      const formatted = JSON.parse(
        byteToString(response),
      ) as DeviceRealTimeInfo;
      if (formatted.type === 'device on' || formatted.type === 'device off') {
        await sleep(1200);
        setEnergyMetric(prevReadings => ({
          ...prevReadings,
          state: formatted.type === 'meter on' ? 'on' : 'off',
        }));
      }
      showMessage({
        message: `${formatted.msg} (${formatted.type})`,
        type: formatted.msg === 'successful' ? 'success' : 'danger',
        position: 'bottom',
      });
      if (formatted.type === 'wallet') {
        // Actions
      }
    }
  };

  useEffect(() => {
    handleAndroidPermissions();
    BleManager.checkState().then(state => {
      if (state !== 'on') {
        BleManager.enableBluetooth().then(() => {
          showMessage({
            message: 'Bluetooth Enabled ',
            type: 'success',
          });
        });
      }
    });

    BleManager.start({showAlert: false}).then(() => {
      console.info('BleManager initialized');
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: Peripheral) => {
        const wordToMatch = 'Smart Socket BLE';
        const regex = /pb/i;
        const localName = peripheral.advertising?.localName;
        if (localName && regex.test(localName)) {
          console.info(
            `Found match for "${wordToMatch}" in localName`,
            peripheral.advertising.serviceUUIDs,
          );
          setPeripherals(map => {
            return new Map(map.set(peripheral.id, peripheral));
          });
        }
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
      },
    );

    let listenedForUpdates = BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );
    let listenedForDisconnection = BleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnections,
    );
    BleManager.getConnectedPeripherals([]).then(async connectedPeripherals => {
      const discoveredDevice = Array.from(connectedPeripherals.values())[0];
      if (Array.from(peripherals.values()).length < 1 && discoveredDevice) {
        connectPeripheral({
          advertising: discoveredDevice?.advertising,
          id: discoveredDevice?.id,
          rssi: discoveredDevice?.rssi,
        });
        setPeripherals(map => {
          return new Map(map.set(discoveredDevice.id, discoveredDevice));
        });
      }
    });

    return () => {
      listenedForUpdates.remove();
      stopDiscoverListener.remove();
      stopScanListener.remove();
      listenedForDisconnection.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characteristics]);

  const handleDisconnections = () => {
    setCharacteristics(undefined);
    setPeripherals(new Map());
    setEnergyMetric(defaultDeviceInfo);
    setLoadingState(defaultLoadingState);
  };

  const scanAvailableDevices = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ).then(async () => {
      setPeripherals(new Map());
      if (!isScanning) {
        const state = await BleManager.checkState();
        if (state === 'off') {
          await BleManager.enableBluetooth();
        }
        BleManager.scan([], 3)
          .then(() => {
            setIsScanning(true);
          })
          .catch(error => {
            showMessage({
              message: error?.toString(),
              type: 'danger',
            });
          });
      }
    });
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      setIsPairing(true);
      if (peripheral) {
        await BleManager.connect(peripheral.id);
        await sleep(900);
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        if (peripheralData.characteristics) {
          const response = {
            peripheralId: peripheral.id,
            serviceId: DEVICE_SERVICE_UUID,
            transfer: TRANSFER_CHARACTERISTIC_UUID,
            receive: RECEIVE_CHARACTERISTIC_UUID,
            meterInfoReading: METER_READING_CHARACTERISTIC_UUID,
          };
          await BleManager.requestMTU(response.peripheralId, 247);
          await BleManager.startNotification(
            response.peripheralId,
            response.serviceId,
            response.meterInfoReading,
          );
          // await sleep(900);
          setCharacteristics(response);
          showMessage({
            message: `Connected to ${peripheral.name ?? peripheral.id} `,
            type: 'success',
            position: 'bottom',
          });
        }
      }
      return true;
    } catch (error) {
      showMessage({
        message: `[connectPeripheral][${peripheral.id}] connectPeripheral error  ${error}`,
        type: 'danger',
      });
      return false;
    } finally {
      setIsPairing(false);
    }
  };

  const disconnectPeripheral = async (peripheralId: string) => {
    await BleManager.disconnect(peripheralId);
    setCharacteristics(undefined);
    setPeripherals(new Map());
    setEnergyMetric(defaultDeviceInfo);
    setLoadingState(defaultLoadingState);
    showMessage({
      message: 'Disconnected successfully',
      type: 'success',
      position: 'bottom',
    });
  };

  const stopScan = async () => {
    await BleManager.stopScan();
    setIsScanning(false);
  };

  const write = async (data: any, services: PeripheralServices) => {
    const MTU = 255;
    await BleManager.startNotification(
      services.peripheralId,
      services.serviceId,
      services.receive,
    );
    await sleep(500);
    await BleManager.write(
      services.peripheralId,
      services.serviceId,
      services.transfer,
      data,
      MTU,
    );
  };

  const read = async (
    service: string,
    peripheral: string,
    characteristic: string,
  ) => {
    const response = await BleManager.read(peripheral, service, characteristic);
    return response;
  };

  const devicePowerControl = async (deviceId: string) => {
    if (characteristics) {
      const command = energyMetric.state === 'off' ? 'on' : 'off';
      try {
        const data = {
          type: 'control',
          id: deviceId,
          data: {
            command: command,
          },
        };
        setLoadingState(state => ({...state, isToggling: true}));
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(JSON.stringify(data));
        const dataArray = Array.from(dataBytes);
        await write(dataArray, characteristics);
      } catch (error) {
        Alert.alert('An Error occurred control device power');
      } finally {
        setLoadingState(state => ({...state, isToggling: false}));
      }
    }
  };

  const topUp = async (deviceId: string, reference: string, amount: string) => {
    if (characteristics) {
      try {
        const token = reference.split('_')[2];
        const payload = JSON.stringify({
          id: deviceId,
          token,
          unit: String(amount),
          type: 'wallet',
        });
        setLoadingState(state => ({...state, isRecharging: true}));
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(payload);
        const dataArray = Array.from(dataBytes);
        await write(dataArray, characteristics);
      } catch (error) {
        Alert.alert('An Error occurred with your top up');
      } finally {
        setLoadingState(state => ({...state, isRecharging: false}));
      }
    }
  };

  const setupWifi = async (
    ssid: string,
    password: string,
    deviceId: string,
  ) => {
    if (characteristics) {
      try {
        setLoadingState(state => ({...state, isConnectingWifi: false}));
        const data = {
          type: 'wifiConfig',
          id: deviceId,
          data: {
            ssid: ssid,
            password: password,
          },
        };
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(JSON.stringify(data));
        const dataArray = Array.from(dataBytes);
        await write(dataArray, characteristics);
      } catch (error) {
        return;
      } finally {
        setLoadingState(state => ({...state, isConnectingWifi: false}));
      }
    }
  };

  const contextValues = {
    read,
    write,
    stopScan,
    isPairing,
    isScanning,
    peripherals,
    loadLimit,
    energyMetric,
    addLoadLimit,
    loadingState,
    topUp,
    setupWifi,
    characteristics,
    connectPeripheral,
    devicePowerControl,
    disconnectPeripheral,
    scanAvailableDevices,
  };

  return (
    <BluetoothContext.Provider value={contextValues}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetoothContext = () => {
  return useContext(BluetoothContext);
};
