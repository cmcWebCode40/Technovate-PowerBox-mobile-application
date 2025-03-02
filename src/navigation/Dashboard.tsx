/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import {Theme, theme as themes} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {AccountScreen, DevicesScreen, HomeScreen, TransactionScreen} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, TextStyle, View} from 'react-native';
import {HomeIcon} from '@/components/common/icons/Home';
import {AccountIcon, AddIcon, TransactionIcon, Typography} from '@/components/common';
import {heightPixel, pixelSizeVertical} from '@/libs/utils';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackScreens } from './type';
import { useAuthContext } from '@/libs/context';

const Tab = createBottomTabNavigator();

type TabBarLabelProps = {
  focused: boolean;
};

export const Dashboard = () => {
  const {tabBarStyle, container} = useThemedStyles(styles);
  const {user} = useAuthContext();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackScreens>>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user?.isDeviceLinked) {
      navigation.navigate('LinkAccount');
    }
  }, [navigation, user?.isDeviceLinked, isFocused]);

  const tabLabelStyle = (focused: boolean): TextStyle => ({
    fontWeight: '600',
    fontSize: themes.fontSize.s,
    fontFamily: themes.fonts.ManropeSemibold,
    borderBottomWidth: 3,
    width: '75%',
    margin: 'auto',
    textAlign: 'center',
    marginBottom: 10,
    paddingVertical: pixelSizeVertical(4),
    borderBottomColor: focused
      ? themes.colors.blue[300]
      : themes.colors.white[100],
    color: focused ? themes.colors.blue[300] : themes.colors.white[100],
  });

  return (
    <View style={container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle,
        }}>
        {tabs.map(item => (
          <Tab.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.name,
              tabBarLabel: ({focused}: TabBarLabelProps) => (
                <Typography variant="b2" style={tabLabelStyle(focused)}>
                  {item.name}
                </Typography>
              ),
              tabBarIcon: item.icon,
            }}
            component={item.component as any}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const updateIconColor = (focused: boolean) => {
  return focused ? themes.colors.blue[300] : themes.colors.white[100];
};

const tabs = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: ({focused}: TabBarLabelProps) => (
      <HomeIcon color={updateIconColor(focused)} />
    ),
  },
  {
    name: 'Monitor',
    component: DevicesScreen,
    icon: ({focused}: TabBarLabelProps) => (
      <AddIcon color={updateIconColor(focused)} />
    ),
  },
  {
    name: 'Transactions',
    component: TransactionScreen,
    icon: ({focused}: TabBarLabelProps) => (
      <TransactionIcon size={'42'} color={updateIconColor(focused)} />
    ),
  },
  {
    name: 'Account',
    component: AccountScreen,
    icon: ({focused}: TabBarLabelProps) => (
      <AccountIcon color={updateIconColor(focused)} />
    ),
  },
];

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // paddingTop: pixelSizeVertical(20),
      backgroundColor: theme.colors.black[100],
    },
    tabBarStyle: {
      elevation: 0,
      borderTopWidth: 0,
      minHeight: heightPixel(65),
      backgroundColor: theme.colors.black[100],
    },
    header: {
      paddingHorizontal: pixelSizeVertical(16),
    },
  });
};
