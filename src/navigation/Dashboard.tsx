/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Theme, theme as themes} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {AccountScreen, DevicesScreen, HomeScreen} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, TextStyle, View} from 'react-native';
import {HomeIcon} from '@/components/common/icons/Home';
import {AccountIcon, AddIcon, Typography} from '@/components/common';
import {heightPixel, pixelSizeVertical} from '@/libs/utils';
import {Header} from '@/components/common/header';

const Tab = createBottomTabNavigator();

type TabBarLabelProps = {
  focused: boolean;
};

export const Dashboard = () => {
  const {tabBarStyle, container, header} = useThemedStyles(styles);
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
      <View style={header}>
        <Header />
      </View>
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
            component={item.component}
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
    name: 'Settings',
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
      paddingTop: pixelSizeVertical(20),
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
