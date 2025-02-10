
import React, {
  createContext,
  useContext,
  useEffect,
} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {useAuthContext} from './AuthContext';
import mqttService from '../mqtt/Mqtt';

const {MqttModule} = NativeModules;
const mqttEmitter = new NativeEventEmitter(MqttModule);

type TCreateContext = {

};

export const MqttContext = createContext<TCreateContext>({

});

interface MqttProviderProps {
  children: React.ReactNode;
}


export const MqttProvider: React.FunctionComponent<MqttProviderProps> = ({
  children,
}) => {
  const {isAuthenticated} = useAuthContext();
  const MQTT_TOPIC = 'paynotification';

  useEffect(() => {
    let timeOutHandler: NodeJS.Timeout;
    const username = 'admin';
    const password = '12345678';

    if (!isAuthenticated) {return;}

    if (username && password) {
        mqttService.connect(username, password).then(() => {
        mqttService.subscribe(MQTT_TOPIC);
      });
    }

    mqttEmitter.addListener('onConnect', data => {
      console.log('Connected:', data);
    });

    mqttEmitter.addListener('onDisconnect', data => {
      console.log('Disconnected:', data);
    });

    mqttEmitter.addListener('onMessage', data => {
      console.log(
        `Message received: ${data.message} on topic ${data.topic} MQTTX`,
      );
    });

    return () => {
      clearTimeout(timeOutHandler);
      mqttEmitter.removeAllListeners('onDisconnect');
      mqttEmitter.removeAllListeners('onMessage');
      mqttEmitter.removeAllListeners('onConnect');
    };
  }, [isAuthenticated]);



  return (
    <MqttContext.Provider value={{}}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttContext = () => {
  return useContext(MqttContext);
};
