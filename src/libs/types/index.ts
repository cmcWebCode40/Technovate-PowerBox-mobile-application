export interface SocketInfo {
  current: number;
  energy: number;
  frequency: number;
  id: string;
  pf: number;
  power: number;
  status: 'on' | 'off';
  voltage: number;
}

export type Sockets = {
  SCK0002?: SocketInfo;
  SCK0001?: SocketInfo;
};

export type SocketResponse = {
  [k: string]: SocketInfo;
};

export type SocketIdentifiers = 'SCK0002' | 'SCK0001';


export interface EnergyMetricResponse {
  channel: Channel
  feeds: Feed[]
}

export interface Channel {
  created_at: string
  description: string
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
  field6: string
  field7: string
  field8: string
  id: number
  last_entry_id: number
  latitude: string
  longitude: string
  name: string
  updated_at: string
}

export interface Feed {
  created_at: string
  entry_id: number
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
  field6: string
  field7: string
  field8: any
}

export type EnergyMetrics = {
  ac_volt: string;
  battery_voltage: string;
  consumption: string;
  power: string;
  bal_unit: number;
  total_unit: number;
  state: string;
  recharge_bal: string;
};

