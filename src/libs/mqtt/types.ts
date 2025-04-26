export interface DeviceRealTimeInfo {
  battVolt: number;
  cell1: number;
  cell2: number;
  cell3: number;
  cell4: number;
  acVolt: number;
  balUnit: number;
  power: number;
  frequency: number;
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
