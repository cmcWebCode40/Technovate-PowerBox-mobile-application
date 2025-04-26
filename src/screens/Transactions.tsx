import {View, StyleSheet, Alert, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {EmptyDataList} from '@/components/common/no-data-ui/EmptyList';
import {Spinner} from '@/components/common/loader/index.';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Theme} from '@/libs/config/theme';
import {Typography} from '@/components/common';
import transactionService, {TransactionParams} from '@/libs/server/Transaction';
import {TransactionItem} from '@/components/transactions/TransactionItem';
import {useAuthContext} from '@/libs/context';

export const TransactionScreen: React.FunctionComponent = () => {
  const [transactions, setTransactions] = useState<
    undefined | TransactionParams[]
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const style = useThemedStyles(styles);
  const {user} = useAuthContext();

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async ()=>{
    if (!user?.userId) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await transactionService.getAllTransactions(
        user.userId,
        'cache',
      );
      const sortedByDateDesc = response.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedByDateDesc);
    } catch (error) {
      Alert.alert('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <Typography style={style.header}>Transactions</Typography>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <View style={style.content}>
          <FlatList
            data={transactions}
            refreshing={isLoading}
            onRefresh={getTransactions}
            keyExtractor={item => item.reference}
            renderItem={({item}) => (
              <TransactionItem
                date={item.date}
                transRef={item.reference}
                amount={item.amount}
                status={item.status}
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
      height:'92%',
    },
    emptyText: {
      textAlign: 'center',
      color: colors.gray[500],
    },
  });
};
