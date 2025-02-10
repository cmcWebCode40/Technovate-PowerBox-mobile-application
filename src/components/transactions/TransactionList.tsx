import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useThemedStyles} from '@/libs/hooks';
import {Theme} from '@/libs/config/theme';
import {pixelSizeVertical} from '@/libs/utils';
import {TransactionItem} from './TransactionItem';
import {EmptyDataList} from '../common/no-data-ui/EmptyList';

// type Transaction = {
//   id: string;
//   date: string;
//   transRef: string;
//   amount: string;
//   status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
// };

type TransactionListProps = {
  transactions: any[];
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  const style = useThemedStyles(styles);

  return (
    <View style={style.container}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TransactionItem
            date={item.date}
            transRef={item.transRef}
            amount={item.amount}
            status={item.status}
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
  );
};

const styles = ({colors}: Theme) => {
  return StyleSheet.create({
    container: {
      paddingVertical: pixelSizeVertical(16),
    },
    emptyText: {
      textAlign: 'center',
      color: colors.gray[500],
    },
  });
};
