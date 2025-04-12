export interface DeviceRealTimeInfo {
  battVolt: number;
  cell1: number;
  cell2: number;
  cell3: number;
  cell4: number;
  acVolt: number;
  balUnit: number;
  solarVoltage: number;
  solarCurrent: number;
  acOut: number;
  chargeCurrent: number;
  battPercent: number;
  state: 'off'|'lock'|'on'|'charging';
  upsFlag: boolean;
  battHealth: number,
  battRCC: number,
  chargeCycles: number,
  usage: number,
  battFCC:number,
  mode: string,
  deviceId: string,
  deviceState: string
  msg?:string;
  type?:string

}



export interface DeviceStatus {
  deviceStatus: 'online' | 'offline';
  id: string;
}

export interface PublishResponse {
    type: string
    msg: string
    id: string
}


const tt = {
  'battVolt': 53.07,
  'battPercent': 96,
  'balUnit': 4.887,
  'totalUnit': 5,
  'battHealth': 100,
  'battRCC': 96.27,
  'chargeCycles': 1,
  'battFCC': 99.98,
  'solarVoltage': 0,
  'solarCurrent': 0,
  'acVolt': 230.3,
  'power': 123.3,
  'usage': 0.113,
  'powerFactor': 1,
  'frequency': 50,
  'chargeCurrent': -3.48,
  'state': 'on',
  'mode': 'prepaid',
  'deviceId': '5100760000001',
  'deviceState': 'discharging',
};
