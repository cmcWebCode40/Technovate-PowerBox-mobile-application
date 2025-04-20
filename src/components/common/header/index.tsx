import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Button} from '../button';
import {AccountIcon, CloseIcon} from '../icons';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackScreens, RootStackScreens} from '@/navigation/type';
import {useAuthContext} from '@/libs/context';
import {colors} from '@/libs/constants';

interface HeaderProps {
  title?: string;
  showHomeIcon?: boolean;
  buttonStyles?: StyleProp<ViewStyle>;
  buttonTextStyles?: StyleProp<TextStyle>;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  title,
  buttonStyles,
  showHomeIcon,
  buttonTextStyles,
}) => {
  const style = useThemedStyles(styles);
  const {user} = useAuthContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackScreens>>();
  const navigateToDashboard = () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate<any>('Main', {screen: 'Dashboard'});
  };
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();

  return (
    <View style={style.container}>
      {showHomeIcon ? (
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToDashboard}>
          <CloseIcon color={'white'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => mainNavigation.navigate('Account')}>
          <AccountIcon size={44} color={colors.white[100]} />
        </TouchableOpacity>
      )}
      <Button
        variant="text"
        style={[style.btn, buttonStyles]}
        textStyles={[style.btnText, buttonTextStyles]}>
        {title ?? `${user?.firstName} ${user?.lastName}`}
      </Button>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate<any>('Main', {screen: 'AddDevice'})}>
        <BluetoothRoundedIcon />
      </TouchableOpacity> */}
      <View />
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.black[100],
    },
    btn: {
      flexBasis: '60%',
      backgroundColor: theme.colors.black[100],
    },
    btnText: {
      color: theme.colors.white[100],
      fontWeight: '600',
      fontSize: theme.fontSize.l,
    },
  });
};
