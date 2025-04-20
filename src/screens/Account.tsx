import {View, StyleSheet, FlatList, Alert, Linking, Platform} from 'react-native';
import React, {useState} from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {LinkIcon, LogoutIcon, Typography, WhatsappIcon} from '@/components/common';
import {useAuthContext} from '@/libs/context';
import {ProfileInformation, SettingCard} from '@/components/settings';
import authInstance from '@/libs/server/Auth';
import {BackDrop} from '@/components/common/modal/BackDrop';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackScreens } from '@/navigation/type';

export const AccountScreen: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const style = useThemedStyles(styles);
  const {clearUser, user} = useAuthContext();
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const address = '---';
  const email = user?.email;
  const phoneNumber = user?.phoneNumber;
  const avatarName = `${firstName?.charAt(0) ?? ''} ${
    lastName?.charAt(0) ?? ''
  }`;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  const whatsappLink = 'https://wa.me/2347067653813';


  const requestToLogout = () => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: logout,
        },
      ],
      { cancelable: false }
    );
  };


  async function logout () {
    try {
      setIsLoading(true);
      await authInstance.logout();
      clearUser();
    } catch (error) {
      Alert.alert(authInstance.handleError(error));
      clearUser();
    } finally {
      setIsLoading(false);
    }
  }

  const openWhatsApp = async () => {
    try {
      await Linking.openURL(whatsappLink);
    } catch (error) {
      Alert.alert('Error', 'Can not open whatsapp');
    }
  };
  const userSettings = [
    {
      title: 'Link Device',
      image: <LinkIcon />,
      screen: 'link-device',
    },
    {
      title: 'Contact Us',
      image: <WhatsappIcon />,
      screen: 'contact-us',
    },
    {
      title: 'Logout',
      image: <LogoutIcon />,
      screen: 'logout',
    },
  ];

  const handleAction = (screen: string) => {
    switch (screen) {
      case 'contact-us':
        openWhatsApp();
        return;
      case 'logout':
        requestToLogout();
        return;
      case 'link-device':
        navigation.navigate('LinkAccount');
        return;
    }
  };
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <View style={style.container}>
        <View style={style.profileHeader}>
          <View style={style.header}>
            <Typography variant="h2" style={style.headerTitle}>
              Account
            </Typography>
          </View>
          <ProfileInformation
            email={email}
            address={address}
            avatarName={avatarName}
            phoneNumber={phoneNumber}
            lastName={lastName}
            firstName={firstName}
            powerBoxId={user?.powerBoxId}
          />
        </View>
        <View style={style.list}>
          <FlatList
            data={userSettings}
            renderItem={({item}) => (
              <SettingCard
                screen={item.screen}
                image={item.image}
                onPress={handleAction}
                title={item.title}
              />
            )}
          />
        </View>
      </View>
    </>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black[100],
    },
    list: {
      marginTop: pixelSizeVertical(40),
    },
    btn: {
      marginBottom: pixelSizeVertical(24),
    },
    header: {
      borderBottomWidth: 1,
      paddingHorizontal: pixelSizeHorizontal(24),
      borderBottomColor: theme.colors.black[300],
      marginBottom: pixelSizeVertical(40),
    },
    headerTitle: {
      textAlign: 'center',
      paddingVertical: pixelSizeVertical(9),
      color: theme.colors.white[100],
      fontWeight: '700',
    },
    title: {
      fontWeight: '700',
      color: theme.colors.white[100],
    },
    account: {
      marginTop: pixelSizeVertical(24),
    },
    line: {},
    profileHeader: {
      backgroundColor: theme.colors.black[200],
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingBottom: '8%',
      ...Platform.select({
        ios:{
          paddingTop: '16%',
        },
        android:{
          paddingTop: '5%',
        }
      }),
    },
  });
};
