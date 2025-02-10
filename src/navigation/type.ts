import {SocketIdentifiers} from '@/libs/types';

export type DeviceRechargePayload = {
  merchantCode: string;
  payItemId: string;
  transactionRef: string;
  amount: number;
  currency: string;
  mode: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
};

export type MainStackScreens = {
  Account: undefined;
  AddDevice: undefined;
  Devices: undefined;
  SubscriptionSelection: undefined;
  LinkAccount: undefined;
  Payment: DeviceRechargePayload;
  Dashboard:{transRef: string};
  DeviceDetails?: {
    socketId: SocketIdentifiers;
  };
};

export type RootStackScreens = {
  Main: MainStackScreens;
  Auth: {
    SignIn: undefined;
  };
};

export type AuthStackScreens = {
  SignIn: undefined;
  SignUp: undefined;
  Welcome:undefined
};
