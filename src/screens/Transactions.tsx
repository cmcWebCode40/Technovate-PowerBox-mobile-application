import {View, StyleSheet} from 'react-native';
import React from 'react';
import {EmptyDataList} from '@/components/common/no-data-ui/EmptyList';
import {Spinner} from '@/components/common/loader/index.';
import {useThemedStyles} from '@/libs/hooks';
import {pixelSizeHorizontal, pixelSizeVertical} from '@/libs/utils';
import {Theme} from '@/libs/config/theme';
import {Typography} from '@/components/common';
import {TransactionList} from '@/components/transactions';

const mockTransactions = [
  {
    id: '1',
    date: '2023-10-01',
    transRef: 'TX123456',
    amount: '₦15,000',
    status: 'SUCCESSFUL',
  },
  {
    id: '2',
    date: '2023-10-02',
    transRef: 'TX654321',
    amount: '₦10,000',
    status: 'FAILED',
  },
  {
    id: '3',
    date: '2023-10-03',
    transRef: 'TX987654',
    amount: '₦5,000',
    status: 'PENDING',
  },
];

export const TransactionScreen: React.FunctionComponent = () => {
  const isLoading = false;
  const transactions: any[] = mockTransactions;
  const style = useThemedStyles(styles);
  return (
    <View style={style.container}>
      <Typography style={style.header}>Transactions</Typography>
      {isLoading ? (
        <Spinner loading={false} />
      ) : (
        <>
          {!mockTransactions || mockTransactions?.length < 1 ? (
            <EmptyDataList
              message="No transactions yet. Recharge your power box to view your
                 transaction history."
            />
          ) : (
            <View>
              <TransactionList transactions={transactions} />
            </View>
          )}
        </>
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
  });
};
