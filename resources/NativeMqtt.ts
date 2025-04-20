import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {

  //MQTT method
  connect(username: string, password: string): string | null;
  disconnect(): string;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string): string;
  onConnect(callback: (reconnect: boolean) => void): void;
  onDisconnect(callback: (error: string) => void): void;
  onMessage(callback: (topic: string, message: string) => void): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeMqtt');
