import {showMessage} from 'react-native-flash-message';
import {useBluetoothContext, useMqttContext} from '../context';

export const useSmartInverterChannel = () => {
  const {
    devicePowerControl: bleDevicePowerControl,
    topUp: bleTopUp,
    characteristics,
    loadingState: bleLoadingState,
  } = useBluetoothContext();

  const {
    deviceUnitTopUp,
    switchUpsMode,
    devicePowerControl: mqttDevicePowerControl,
    connectivity,
    loadingState: mqttLoadingState,
  } = useMqttContext();

  const isBluetoothConnected = !!characteristics;

  const loadingState = {
    isRecharging: bleLoadingState.isRecharging || mqttLoadingState.isRecharging,
    isToggling: bleLoadingState.isToggling || mqttLoadingState.isToggling,
    isUpsLoading: bleLoadingState.isUpsLoading || mqttLoadingState.isUpsLoading,
  };

  const notifyOffline = () => {
    showMessage({
      message: 'Inverter connectivity is currently offline',
      type: 'warning',
    });
  };

  const isDeviceOnline = () => connectivity.deviceStatus !== 'offline';

  const toggleDevice = (deviceId: string) => {
    if (isBluetoothConnected) {
      bleDevicePowerControl(deviceId);
      return;
    }

    if (!isDeviceOnline()) {
      notifyOffline();
      return;
    }

    mqttDevicePowerControl();
  };

  const rechargeDevice = (
    deviceId: string,
    reference: string,
    amount: string,
  ) => {
    if (isBluetoothConnected) {
      bleTopUp(deviceId, reference, amount);
      return;
    }

    if (!isDeviceOnline()) {
      notifyOffline();
      return;
    }

    deviceUnitTopUp(amount, reference);
  };

  const toggleUpsMode = (mode: boolean) => {
    if (!isDeviceOnline()) {
      notifyOffline();
      return;
    }

    switchUpsMode(mode);
  };

  return {
    loadingState,
    toggleDevice,
    toggleUpsMode,
    rechargeDevice,
  };
};
