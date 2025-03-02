import React, {useCallback, useState} from 'react';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {MainStackScreens} from '@/navigation/type';
import IswPaymentWebView from '@/libs/isw-pay/IswPaymentWebView';
import { Config } from '@/libs/config/keys';


export type IswTestMode = 'TEST' | 'LIVE';

type PaymentScreenProps = NativeStackScreenProps<MainStackScreens, 'Payment'>;

export const PaymentScreen: React.FunctionComponent<PaymentScreenProps> = ({
  route,
}) => {
  const [autoStart, setAutoStart] = useState(true);
  const {params} = route;
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreens>>();
  const {
    amount,
    currency,
    customerEmail,
    customerId,
    customerName,
    merchantCode,
    payItemId,
    mode,
    transactionRef,
  } = params;

  const navigator = useCallback(
    (navParams?: {transRef: string, amount:number}) => {
      navigation.navigate<any>('Dashboard', {
        screen: 'Home',
        params: navParams,
      });
    },
    [navigation],
  );

  const handleCallback = () => {
    setAutoStart(false);
    navigator({
      amount : amount,
      transRef: transactionRef,
    });
  };


  return (
    <>
      {params.merchantCode ? (
        <IswPaymentWebView
          amount={amount}
          currency={currency}
          mode={mode as IswTestMode}
          autoStart={autoStart}
          customer={{
            email: customerEmail,
            name: customerName,
            id: customerId,
          }}
          payItem={{id: payItemId}}
          trnxRef={transactionRef}
          merchantCode={merchantCode}
          onCompleted={handleCallback}
          checkoutUrl={Config.ISW_WEB_CHECKOUT_URL}
        />
      ) : null}
    </>
  );
};
