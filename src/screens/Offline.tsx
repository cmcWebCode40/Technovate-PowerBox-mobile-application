import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {Theme} from '@/libs/config/theme';
import {useThemedStyles} from '@/libs/hooks';
import {createHitSlop, pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {
  OfflineOverview,
} from '@/components/energy-device-cards';
import {useAuthContext, useBluetoothContext} from '@/libs/context';
import {Button, Typography} from '@/components/common';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {useNavigation} from '@react-navigation/native';
import { ScreenLayout } from '@/components/common/layout';

export const OfflineScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const {user} = useAuthContext();
  const {characteristics, disconnectPeripheral} =
    useBluetoothContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  const connectBle = () => {
    navigation.navigate('AddDevice');
  };

  const disconnect = () => {
    if (characteristics?.peripheralId) {
      disconnectPeripheral(characteristics.peripheralId);
    }
  };


  const wifiSettings = () => {
    navigation.navigate('WifiSetting');
  };

  return (
    <ScreenLayout style={style.container}>
      <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
        <Typography style={style.header}>Offline Mode</Typography>
        <View style={style.details}>
          <OfflineOverview
            socketNo={user?.powerBoxId}
            isConnected={!!characteristics}
          />
          {characteristics ? (
            <>
              <View style={style.wifi}>
                <View />
                <TouchableOpacity hitSlop={createHitSlop(20)} onPress={wifiSettings}>
                  <Typography style={style.wifiText}>Wifi Settings</Typography>
                </TouchableOpacity>
              </View>
              <View>
                <View style={style.btnContainer}>
                  <Button
                    variant="text"
                    onPress={disconnect}
                    style={style.btnActions}>
                    Disconnect BLE
                  </Button>
                </View>
              </View>
            </>
          ) : (
            <Button onPress={connectBle}>Connect With Bluetooth</Button>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
      justifyContent: 'space-between',
      paddingBottom: pixelSizeVertical(40),
    },
    details: {
      marginVertical: 12,
    },
    content: {
      marginTop: pixelSizeVertical(24),
    },
    deviceItem: {
      marginBottom: pixelSizeVertical(40),
    },
    infoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    wifi: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    infoCard: {
      width: '48%',
      flexGrow: 1,
    },
    header: {
      textAlign: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom:'15%',
    },
    btnActions: {
      width: '100%',
      borderRadius: theme.radius.lg,
    },
    wifiText: {
      textDecorationLine: 'underline',
      fontWeight: '600',
    },
  });
};
