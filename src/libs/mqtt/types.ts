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


