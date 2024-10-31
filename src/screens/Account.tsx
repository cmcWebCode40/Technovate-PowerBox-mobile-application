import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Button, Typography} from '@/components/common';
import {useAuthContext} from '@/libs/context';
import {Iconify} from 'react-native-iconify';

const accounts = [
  {
    title: 'Logout',
    icon: <Iconify icon="ep:switch" />,
  },
];

export const AccountScreen: React.FunctionComponent = () => {
  const style = useThemedStyles(styles);
  const {clearUser} = useAuthContext();
  return (
    <View style={style.container}>
      <View>
      <View style={style.line} />
      <View style={style.account}>
        <Typography variant="h1" style={style.title}>
          Account
        </Typography>
        {accounts.map(item => (
          <View style={style.configContainer} key={item.title}>
            <View style={style.configContainerIcon}>
              <Typography variant="b1" style={style.optionText}>
                {item.title}
              </Typography>
            </View>
          </View>
        ))}
      </View>
      </View>
      <Button variant="contained" onPress={clearUser} style={style.btn}>
        Logout
      </Button>
    </View>
  );
};

const styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(24),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: theme.colors.black[100],
justifyContent:'space-between',
    },
    btn: {
      marginBottom: pixelSizeVertical(24),
    },
    configContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: pixelSizeVertical(8),
      borderBottomColor: theme.colors.gray[100],
      borderBottomWidth: 1,
      paddingVertical: pixelSizeVertical(8),
    },
    configContainerIcon: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionText: {
      fontWeight: '600',
      color: theme.colors.white[100],
    },
    title: {
      fontWeight: '700',
      color: theme.colors.white[100],
    },
    account: {
      marginTop: pixelSizeVertical(24),
    },
    line: {},
  });
};
