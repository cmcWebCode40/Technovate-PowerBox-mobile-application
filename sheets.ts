import { BluetoothSheet } from '@/components/energy-usage-progress-indicator/BluetoothSheet';
import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';


registerSheet('bluetooth-connect-sheet', BluetoothSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'bluetooth-connect-sheet': SheetDefinition<{
      payload: {
        value: string;
      };
    }>;
  }
}

export {};
