import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeVertical} from '@/libs/utils';
import {Button} from '@/components/common';
import {TransactionItem} from '@/components/transactions/TransactionItem';
import {Header} from '@/components/common/header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackScreens} from '@/navigation/type';
import {useAuthContext, useMqttContext} from '@/libs/context';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common/layout';
import { useSmartInverterChannel } from '@/libs/hooks/useSmartInverterChannel';

type TransactionDetailScreenProps = NativeStackScreenProps<
  MainStackScreens,
  'TransactionDetails'
>;

export const TransactionDetailScreen: React.FunctionComponent<
  TransactionDetailScreenProps
> = ({route: {params}}) => {
  const style = useThemedStyles(styles);
  const {connectivity} = useMqttContext();
  const navigation =
  useNavigation();
  const {rechargeDevice, loadingState} =
    useSmartInverterChannel();
    const {user} = useAuthContext();

  const shouldShowLoadUnitButton =
    connectivity.deviceStatus === 'online' &&
    params.status === 'SUCCESSFUL' &&
    params.loadStatus === 'PENDING';

  return (
    <ScreenLayout>
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
            if (user?.powerBoxId) {
              rechargeDevice(user?.powerBoxId, params.transRef, params.amount as string).then(()=>{
                navigation.goBack();
              });
            }
          }}>
          Push Unit to Device
        </Button>
      )}
    </ScreenLayout>
  );
};

const styles = () => {
  return StyleSheet.create({
    content: {
      paddingVertical: pixelSizeVertical(16),
    },
  });
};
