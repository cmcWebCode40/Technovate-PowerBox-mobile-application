import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, NativeEventEmitter, NativeModules} from 'react-native';
import {useAuthContext} from './AuthContext';
import mqttService from '../mqtt/Mqtt';
import {DeviceRealTimeInfo, DeviceStatus, PublishResponse} from '../mqtt/types';
import {showMessage} from 'react-native-flash-message';
import transactionService from '../server/Transaction';

// const {MqttModule} = NativeModules;
// const mqttEmitter = new NativeEventEmitter(MqttModule);

type LoadingState = {
  isRecharging: boolean;
  isToggling: boolean;
  isUpsLoading: boolean;
};

const defaultDeviceInfo = {
  battVolt: 0,
  cell1: 0,
  cell2: 0,
  cell3: 0,
  cell4: 0,
  balUnit: 0,
  solarVoltage: 0,
  solarCurrent: 0,
  acOut: 0,
  acVolt: 0,
  chargeCurrent: 0,
  battPercent: 0,
  state: 'off',
  upsFlag: false,
} as DeviceRealTimeInfo;

const defaultLoadingState = {
  isRecharging: false,
  isToggling: false,
  isUpsLoading: false,
};

type TCreateContext = {
  connectivity: DeviceStatus;
  loadingState: LoadingState;
  deviceReading: DeviceRealTimeInfo;
  switchUpsMode: (mode: boolean) => void;
  devicePowerControl: () => Promise<void>;
  deviceUnitTopUp: (unit: string, reference: string) => Promise<void>;
};

export const MqttContext = createContext<TCreateContext>({
  deviceReading: defaultDeviceInfo,
  loadingState: defaultLoadingState,
  devicePowerControl: async () => undefined,
  deviceUnitTopUp: async () => undefined,
  connectivity: {
    deviceStatus: 'offline',
    id: '',
  },
  switchUpsMode: async () => undefined,
});

interface MqttProviderProps {
  children: React.ReactNode;
}

export const MqttProvider: React.FunctionComponent<MqttProviderProps> = ({
  children,
}) => {
  const [deviceReading, setDeviceReading] =
    useState<DeviceRealTimeInfo>(defaultDeviceInfo);
  const {isAuthenticated, user} = useAuthContext();
  const [connectivity, setConnectivity] = useState<DeviceStatus>({
    deviceStatus: 'offline',
    id: '',
  });
  const [loadingState, setLoadingState] = useState(defaultLoadingState);
  const [pendingTopUpReference, setPendingTopUpReference] = useState<
    string | undefined
  >(undefined);
  const READING_TOPIC = `POWERBOX/READING/${user?.powerBoxId}`;
  const STATUS_TOPIC = `POWERBOX/STATUS/${user?.powerBoxId}`;
  const RESPONSE_TOPIC = `POWERBOX/RESPONSE/${user?.powerBoxId}`;
  const CONTORL_PUBLISH_TOPIC = `POWERBOX/CONTROL/${user?.powerBoxId}`;
  const TOP_UP_PUBLISH_TOPIC = `POWERBOX/WALLET/${user?.powerBoxId}`;
  const UPS_MODE_PUBLISH_TOPIC = `POWERBOX/CONFIG/${user?.powerBoxId}`;

  useEffect(() => {
    let timeOutHandler: NodeJS.Timeout;
    const username = 'admin';
    const password = '12345678';

    if (!isAuthenticated) {
      return;
    }

    if (username && password && user?.isDeviceLinked) {
      mqttService.connect(username, password).then(() => {
        mqttService.subscribe(READING_TOPIC);
        mqttService.subscribe(RESPONSE_TOPIC);
        mqttService.subscribe(STATUS_TOPIC);
      });
    }

    // mqttEmitter.addListener('onConnect', data => {
    //   console.log('Connected:', data);
    // });

    // mqttEmitter.addListener('onDisconnect', data => {
    //   console.log('Disconnected:', data);
    // });

    // mqttEmitter.addListener('onMessage', async data => {
    //   if (data.topic === READING_TOPIC) {
    //     const parsedMessage = JSON.parse(
    //       data.message?.toString(),
    //     ) as DeviceRealTimeInfo;
    //     setDeviceReading(parsedMessage);
    //     console.log(
    //       `Message received: ${data.message} on topic ${data.topic} MQTTX`,
    //     );
    //   }
    //   if (data.topic === STATUS_TOPIC) {
    //     const parsedConnectivity = JSON.parse(
    //       data.message?.toString(),
    //     ) as DeviceStatus;
    //     setConnectivity(parsedConnectivity);
    //     console.log(
    //       `Message received: ${data.message} on topic ${data.topic} MQTTX`,
    //     );
    //   }
    //   if (data.topic === RESPONSE_TOPIC) {
    //     const parsedResponse = JSON.parse(
    //       data.message?.toString(),
    //     ) as PublishResponse;

    //     if (
    //       parsedResponse.type === 'wallet recharge' &&
    //       parsedResponse.msg === 'successful'
    //     ) {
    //       if (pendingTopUpReference) {
    //         await transactionService
    //           .updateLoadStatus(pendingTopUpReference, 'SUCCESSFUL')
    //           .then(() => {
    //             setPendingTopUpReference(undefined);
    //             showMessage({
    //               position: 'bottom',
    //               message: parsedResponse.msg,
    //               type:
    //                 parsedResponse.msg === 'successful' ? 'success' : 'danger',
    //             });
    //           });
    //       }
    //     } else {
    //       showMessage({
    //         position: 'bottom',
    //         message: parsedResponse.msg,
    //         type: parsedResponse.msg === 'successful' ? 'success' : 'danger',
    //       });
    //     }
    //     console.log('============parsedResponse========================');
    //     console.log(parsedResponse);
    //     console.log('====================================');
    //     console.log(
    //       `Message received: ${data.message} on topic ${data.topic} MQTTX`,
    //     );
    //   }
    // });

    return () => {
      clearTimeout(timeOutHandler);
      // mqttService.unSubscribe(READING_TOPIC);
      // mqttService.unSubscribe(RESPONSE_TOPIC);
      // mqttService.unSubscribe(STATUS_TOPIC);
      // mqttEmitter.removeAllListeners('onDisconnect');
      // mqttEmitter.removeAllListeners('onMessage');
      // mqttEmitter.removeAllListeners('onConnect');
    };
  }, [
    READING_TOPIC,
    RESPONSE_TOPIC,
    STATUS_TOPIC,
    isAuthenticated,
    pendingTopUpReference,
    user?.isDeviceLinked,
  ]);

  const devicePowerControl = async () => {
    console.log(deviceReading.state, 'STATE===');
    if (deviceReading.state === 'charging') {
      showMessage({
        position: 'top',
        message: 'Device currently Charging',
        type: 'info',
      });

      return;
    }
    if (deviceReading.state === 'lock') {
      showMessage({
        position: 'top',
        message: 'Device currently LOCKED contact Admin',
        type: 'info',
      });
      return;
    }
    const command = deviceReading.state === 'off' ? 'on' : 'off';
    try {
      const payload = JSON.stringify({
        id: user?.powerBoxId,
        command,
      });
      setLoadingState(state => ({...state, isToggling: true}));
      if (user?.powerBoxId) {
        await mqttService.publish(CONTORL_PUBLISH_TOPIC, payload);
      }
    } catch (error) {
      Alert.alert('An Error occurred control device power');
    } finally {
      setLoadingState(state => ({...state, isToggling: false}));
    }
  };

  const deviceUnitTopUp = async (unit: string, reference: string) => {
    try {
      const token = reference.split('_')[2];
      const payload = JSON.stringify({
        id: user?.powerBoxId,
        token,
        unit: String(unit),
      });
      setLoadingState(state => ({...state, isRecharging: true}));
      if (user?.powerBoxId) {
        await mqttService.publish(TOP_UP_PUBLISH_TOPIC, payload);
        setPendingTopUpReference(reference);
      }
    } catch (error) {
      Alert.alert('An Error recharging up your device, please try again');
    } finally {
      setLoadingState(state => ({...state, isRecharging: false}));
    }
  };

  const switchUpsMode = async (upsMode: boolean) => {
    try {
      const payload = JSON.stringify({
        id: user?.powerBoxId,
        command: upsMode ? 'off' : 'on',
        type: 'upsMode',
      });
      setLoadingState(state => ({...state, isUpsLoading: true}));
      if (user?.powerBoxId) {
        await mqttService.publish(UPS_MODE_PUBLISH_TOPIC, payload);
      }
    } catch (error) {
      Alert.alert('An Error recharging up your device, please try again');
    } finally {
      setLoadingState(state => ({...state, isUpsLoading: false}));
    }
  };

  return (
    <MqttContext.Provider
      value={{
        deviceReading,
        deviceUnitTopUp,
        devicePowerControl,
        loadingState,
        connectivity,
        switchUpsMode,
      }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttContext = () => {
  return useContext(MqttContext);
};
