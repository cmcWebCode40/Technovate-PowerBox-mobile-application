import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Theme} from '@/libs/config/theme';
import {Button} from '@/components/common';
import {TransactionItem} from '@/components/transactions/TransactionItem';
import {Header} from '@/components/common/header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {useMqttContext} from '@/libs/context';
import { useNavigation } from '@react-navigation/native';

type TransactionDetailScreenProps = NativeStackScreenProps<
  MainStackScreens,
  'TransactionDetails'
>;

export const TransactionDetailScreen: React.FunctionComponent<
  TransactionDetailScreenProps
> = ({route: {params}}) => {
  const style = useThemedStyles(styles);
  const {deviceUnitTopUp, loadingState, connectivity} = useMqttContext();
  const navigation =
  useNavigation();

  const shouldShowLoadUnitButton =
    connectivity.deviceStatus === 'online' &&
    params.status === 'SUCCESSFUL' &&
    params.loadStatus === 'PENDING';

  return (
    <View style={style.container}>
      <Header showHomeIcon title="Transaction Details" />
      <View style={style.content}>
        <TransactionItem
          date={params.date}
          transRef={params.transRef}
          amount={params.amount}
          status={params.status}
          loadStatus={params.loadStatus}
        />
      </View>
      {shouldShowLoadUnitButton && (
        <Button
          loading={loadingState.isRecharging}
          disabled={loadingState.isRecharging}
          onPress={() => {
            deviceUnitTopUp(params.amount as string, params.transRef).then(()=>{
              navigation.goBack();
            });
          }}>
          Push Unit to Device
        </Button>
      )}
    </View>
  );
};

const styles = ({colors}: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: pixelSizeVertical(16),
      paddingHorizontal: pixelSizeHorizontal(16),
      backgroundColor: colors.black[100],
    },
    content: {
      paddingVertical: pixelSizeVertical(16),
    },
  });
};
