import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Dashboard} from './Dashboard';
import {
  AddDeviceScreen,
  DeviceDetailsScreen,
  LinkAccountScreen,
  SignInScreen,
  SignupScreen,
  SubscriptionSelectionScreen,
} from '@/screens';
import {useAuthContext} from '@/libs/context';
import {AuthStackScreens} from './type';
import {WelcomeScreen} from '@/screens/Welcome';

const RootStack = createNativeStackNavigator<any>();
const MainStack = createNativeStackNavigator<any>();
const AuthStack = createNativeStackNavigator<AuthStackScreens>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MainStack.Screen name="Dashboard" component={Dashboard} />
      <MainStack.Screen name="AddDevice" component={AddDeviceScreen} />
      <MainStack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
      <MainStack.Screen name="LinkAccount" component={LinkAccountScreen} />
      <MainStack.Screen name="SubscriptionSelection" component={SubscriptionSelectionScreen} />
    </MainStack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignUp" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

export const RootNavigator: React.FunctionComponent = () => {
  const {isAuthenticated} = useAuthContext();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};
