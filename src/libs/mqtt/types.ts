

// doc["bv"] = batteryVoltage;                   // battVolt
// doc["bp"] = batteryCapacityPercent;           // battPercent
// doc["bu"] = balUnit;                          // balUnit
// doc["tu"] = totalUnit;                        // totalUnit
// doc["bh"] = batteryVoltageFromSCCPercent;     // battHealth

// doc["sv"] = pvInputVoltage;                   // solarVoltage
// doc["sc"] = pvInputCurrentA;                  // solarCurrent
// doc["av"] = gridVoltage;                      // acVolt
// doc["pw"] = acOutputPowerW;                   // power
// doc["usg"] = usage;                           // usage
// doc["pf"] = powerFactor;                      // powerFactor
// doc["frq"] = acOutputFrequency;               // frequency
// doc["cc"] = batteryChargingCurrentA;          // chargeCurrent

// doc["st"] = pwrBState;                        // state
// doc["md"] = deviceMode;                       // mode
// doc["id"] = deviceId;                         // deviceId
// doc["ds"] = deviceState;                      // deviceState
// doc["fw"] = firmwareVersion;

export interface DeviceRealTimeInfo {
  bv: number;
  bp: number;
  bu: number;
  tu: number;
  bh: number;
  sv: number;
  sc: number;
  av: number;
  pw: number;
  pf: number;
  frq: number;
  cc: number;
  usg: number;
  st: 'off'|'lock'|'on'|'charging';
  md: boolean;
  id: number,
  ds: number,
  fw:string
}

export interface DeviceActionResponse {
msg:string;
type:string;
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
