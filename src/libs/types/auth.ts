export interface UserInfo {
    email?: string
    firstName?: string
    lastName?: string
    userId:string;
    phoneNumber?: string;
    creationTime?:string;
    emailVerified:boolean;
    powerBoxId?:string
    planBalance?: number, 
    planType?: string,
    isDeviceLinked?:boolean,
  }
