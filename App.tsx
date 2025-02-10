import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from '@/navigation';
import FlashMessage from 'react-native-flash-message';
import {AuthProvider, MqttProvider} from '@/libs/context';
import SplashScreen from 'react-native-splash-screen';

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

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
