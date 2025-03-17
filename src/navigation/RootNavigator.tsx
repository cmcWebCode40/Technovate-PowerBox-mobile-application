import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Dashboard} from './Dashboard';
import {
  LinkAccountScreen,
  PaymentScreen,
  SignInScreen,
  SignupScreen,
  SubscriptionSelectionScreen,
} from '@/screens';
import {useAuthContext} from '@/libs/context';
import {AuthStackScreens, MainStackScreens} from './type';
import {WelcomeScreen} from '@/screens/Welcome';
import { TransactionDetailScreen } from '@/screens/TransactionDetails';
import TestScreen from '@/screens/TestScreen';

const RootStack = createNativeStackNavigator<any>();
const MainStack = createNativeStackNavigator<MainStackScreens>();
const AuthStack = createNativeStackNavigator<AuthStackScreens>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MainStack.Screen name="Dashboard" component={Dashboard} />
      <MainStack.Screen name="LinkAccount" component={LinkAccountScreen} />
      <MainStack.Screen name="Payment" component={PaymentScreen} />
      <MainStack.Screen name="TransactionDetails" component={TransactionDetailScreen} />
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
      {/* <AuthStack.Screen name="SignIn" component={SignInScreen} /> */}
      <AuthStack.Screen name="Welcome" component={TestScreen} />
      {/* <AuthStack.Screen name="Welcome" component={WelcomeScreen} /> */}
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
