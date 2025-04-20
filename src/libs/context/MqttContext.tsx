import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert } from 'react-native';
import {useAuthContext} from './AuthContext';
import {DeviceRealTimeInfo, DeviceStatus, PublishResponse} from '../mqtt/types';
import {showMessage} from 'react-native-flash-message';
import transactionService from '../server/Transaction';
import mqtt from 'mqtt';

type LoadingState = {
  isRecharging: boolean;
  isToggling: boolean;
  isUpsLoading: boolean;
};

export const defaultDeviceInfo = {
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
  battHealth: 0,
  battRCC: 0,
  chargeCycles: 0,
  usage: 0,
  battFCC:0,
  mode: '-----',
  deviceId: '-----',
  deviceState: '----',
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
  const [mqttClient, setMqttClient] = useState<null|mqtt.MqttClient>(null);
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

    if (username && password && user?.isDeviceLinked && user?.powerBoxId) {
      const host = 'x7cb07b8.ala.eu-central-1.emqxsl.com';
      const path = '/mqtt';
      let port = '8084';
      let protocol = 'wss';
      console.log('============CONNECTION========================');
      console.log(`${protocol}://${host}:${port}${path}`);
      console.log('====================================');
      const client = mqtt.connect(`${protocol}://${host}:${port}${path}`, {
      clientId: `CLIENT_${user?.powerBoxId}`,
      username:'emqx_online_test_018094ea',
      password: '87a6B2027D163!5bfL!98T3559Jaa667',
      reconnectPeriod:1000,
      connectTimeout: 30 * 1000,
      })
      .on('connect', () => {
        console.log('Connected');
        client.subscribe(READING_TOPIC);
        client.subscribe(RESPONSE_TOPIC);
        client.subscribe(STATUS_TOPIC);
      })
      .on('error', (error) => {
        console.log('Error');
        console.log('MqttGeneral', error);
      })
      .on('disconnect', () => {
        console.log('Disconnected');
        setDeviceReading(defaultDeviceInfo)
      })
      .on('offline', () => {
        console.log('Offline');
      })
      .on('reconnect', () => {
        console.log('Reconnecting');
      })
      .on('close', () => {
        console.log('Disconnected');
      })
      .on('message', async (topic, data) => {
        if (topic === READING_TOPIC) {
          const parsedMessage = JSON.parse(
            data?.toString(),
          ) as DeviceRealTimeInfo;
          setDeviceReading(parsedMessage);
          console.log(
            `Message received: ${data} on topic ${topic} MQTTX`,
          );
        }
        if (topic === STATUS_TOPIC) {
          const parsedConnectivity = JSON.parse(
            data?.toString(),
          ) as DeviceStatus;
          setConnectivity(parsedConnectivity);
          console.log(
            `Message received: ${data} on topic ${topic} MQTTX`,
          );
        }
        if (topic === RESPONSE_TOPIC) {
          const parsedResponse = JSON.parse(
            data?.toString(),
          ) as PublishResponse;
  
          if (
            parsedResponse.type === 'wallet recharge' &&
            parsedResponse.msg === 'successful'
          ) {
            if (pendingTopUpReference) {
              await transactionService
                .updateLoadStatus(pendingTopUpReference, 'SUCCESSFUL')
                .then(() => {
                  setPendingTopUpReference(undefined);
                  showMessage({
                    position: 'bottom',
                    message: parsedResponse.msg,
                    type:
                      parsedResponse.msg === 'successful' ? 'success' : 'danger',
                  });
                });
            }
          } else {
            showMessage({
              position: 'bottom',
              message: parsedResponse.msg,
              type: parsedResponse.msg === 'successful' ? 'success' : 'danger',
            });
          }
          console.log('============parsedResponse========================');
          console.log(parsedResponse);
          console.log('====================================');
          console.log(
            `Message received: ${data} on topic ${topic} MQTTX`,
          );
        }
      });
      setMqttClient(client);
    }

    return () => {
      clearTimeout(timeOutHandler);
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
      // mqttClient?.off('connect',()=>{});
    };
  }, [READING_TOPIC, RESPONSE_TOPIC, STATUS_TOPIC, isAuthenticated, pendingTopUpReference, user?.isDeviceLinked, user?.powerBoxId]);

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
        mqttClient?.publish(CONTORL_PUBLISH_TOPIC, payload);
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
         mqttClient?.publish(TOP_UP_PUBLISH_TOPIC, payload);
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
        await mqttClient?.publish(UPS_MODE_PUBLISH_TOPIC, payload);
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
