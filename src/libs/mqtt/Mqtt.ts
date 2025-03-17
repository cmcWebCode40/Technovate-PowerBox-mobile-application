import {NativeModules} from 'react-native';

const {MqttModule} = NativeModules;

// import NativeMqttModuleSpec from '@/specs/NativeMqttModuleSpec';

console.log('=============MqttModule======================');
console.log(NativeModules);
console.log('====================================');

class MqttService {
  private mqttModule:any

  constructor(mqttModule: any) {
    this.mqttModule = {};
  }

  async connect(username: string, password: string): Promise<void> {
    try {
      const result = await this.mqttModule.connect(username, password);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      const result = await this.mqttModule.disconnect();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async subscribe(topic: string, qos: number = 1): Promise<void> {
    try {
      // const result = await this.mqttModule.subscribe(topic, qos);
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async unSubscribe(topic: string): Promise<void> {
    try {
      // const result = await this.mqttModule.unsubscribe(topic);
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async publish(
    topic: string,
    message: string,
    qos: number = 1,
  ): Promise<void> {
     await this.mqttModule.publish(topic, message, qos);
  }
}

// Instantiate with dependency injection
const mqttService = new MqttService({});
export default mqttService;
