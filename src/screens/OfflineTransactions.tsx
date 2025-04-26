import {View, StyleSheet, Alert, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {EmptyDataList} from '@/components/common/no-data-ui/EmptyList';
import {Spinner} from '@/components/common/loader/index.';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Theme} from '@/libs/config/theme';
import transactionService, {TransactionParams} from '@/libs/server/Transaction';
import {TransactionItem} from '@/components/transactions/TransactionItem';
import {useAuthContext, useBluetoothContext} from '@/libs/context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Header} from '@/components/common/header';
import {BackDrop} from '@/components/common/modal/BackDrop';
import {showMessage} from 'react-native-flash-message';

export const OfflineTransactionScreen: React.FunctionComponent = () => {
  const [transactions, setTransactions] = useState<
    undefined | TransactionParams[]
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const style = useThemedStyles(styles);
  const {user} = useAuthContext();
  const isFocused = useIsFocused();
  const {topUp, loadingState} = useBluetoothContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user?.userId) {
      return;
    }
    (async () => {
      try {
        setIsLoading(true);
        const response = await transactionService.getAllTransactions(
          user.userId,
          'server',
        );
        const pendingTransactions = response.filter(
          item => item.status === 'SUCCESSFUL' && item.loadStatus === 'PENDING',
        );
        setTransactions(pendingTransactions);
      } catch (error) {
        Alert.alert('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.userId, isFocused]);

  const handleTopUp = async (transRef: string, amount: string | number) => {
    if (user?.powerBoxId) {
      try {
        await topUp(user?.powerBoxId, transRef, String(amount));
        await transactionService.updateLoadStatus(transRef, 'SUCCESSFUL');
        navigation.goBack();
      } catch (error) {
        showMessage({
          message: 'Error updating load status',
          type: 'danger',
        });
        await transactionService.updateLoadStatus(transRef, 'FAILED');
      }
    }
  };

  return (
    <View style={style.container}>
      <BackDrop isLoading={loadingState.isRecharging} />
      <Header showHomeIcon title="Pending Recharge" />
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <View style={style.content}>
          <FlatList
            data={transactions}
            keyExtractor={item => item.reference}
            renderItem={({item}) => (
              <TransactionItem
                date={item.date}
                transRef={item.reference}
                amount={item.amount}
                status={item.status}
                isOfflineMode={true}
                loadUnit={handleTopUp}
                loadStatus={item.loadStatus}
              />
            )}
            ListEmptyComponent={
              <EmptyDataList
                message="No transactions yet. Recharge your power box to view your
               transaction history."
              />
            }
          />
        </View>
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
    header: {
      textAlign: 'center',
    },
    content: {
      paddingVertical: pixelSizeVertical(16),
    },
    emptyText: {
      textAlign: 'center',
      color: colors.gray[500],
    },
  });
};
