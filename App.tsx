import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from '@/navigation';
import FlashMessage from 'react-native-flash-message';
import {
  AuthProvider,
  BluetoothContextProvider,
  MqttProvider,
} from './src/libs/context';
import {SheetProvider} from 'react-native-actions-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import './sheets';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
          <BluetoothContextProvider>
            <NavigationContainer>
              <AuthProvider>
                <MqttProvider>
                  <SheetProvider>
                    <StatusBar barStyle={'default'} />
                    <RootNavigator />
                  </SheetProvider>
                </MqttProvider>
              </AuthProvider>
            </NavigationContainer>
            <FlashMessage position="top" />
          </BluetoothContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
