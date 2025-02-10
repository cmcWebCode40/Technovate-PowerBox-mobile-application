import React, {useCallback, useState} from 'react';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {MainStackScreens} from '@/navigation/type';
import { Button } from '@/components/common';

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
    (navParams?: {transRef: string}) => {
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
      transRef: transactionRef,
    });
  };

  const redirectUrl = 'https://example.com/payment-response';
  const checkoutUrl =
    'https://newwebpay.qa.interswitchng.com/collections/w/pay';

  return (
    <>
    <Button onPress={handleCallback} style={{justifyContent:'center', marginVertical:'25%'}}>
      VERIFY PAYMENT
    </Button>
      {/* {params.merchantCode ? (
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
          redirectUrl={redirectUrl}
          payItem={{id: payItemId}}
          trnxRef={transactionRef}
          merchantCode={merchantCode}
          onCompleted={handleCallback}
          checkoutUrl={checkoutUrl}
        />
      ) : null} */}
    </>
  );
};
