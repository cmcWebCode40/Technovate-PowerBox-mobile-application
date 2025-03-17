
import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from '@/navigation';
import FlashMessage from 'react-native-flash-message';
import {AuthProvider, MqttProvider} from './src/libs/context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <>
        <NavigationContainer>
          <AuthProvider>
            <MqttProvider>
              <StatusBar barStyle={'default'} />
              <RootNavigator />
            </MqttProvider>
          </AuthProvider>
        </NavigationContainer>
        <FlashMessage position="top" />
      </>
    </SafeAreaProvider>
  );
}

export default App;
