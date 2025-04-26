import React, {useCallback, useState} from 'react';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {MainStackScreens} from '@/navigation/type';
import {Config} from '@/libs/config/keys';
import {StyleSheet} from 'react-native';
import { IswPaymentWebView } from 'react-native-interswitch-pay';
import { ScreenLayout } from '@/components/common/layout';
import { colors } from '@/libs/constants';

export type IswTestMode = 'TEST' | 'LIVE';

type PaymentScreenProps = NativeStackScreenProps<MainStackScreens, 'Payment'>;

type TIswPaymentWebView = React.ComponentRef<typeof IswPaymentWebView>;

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
  const IswWebViewRef = React.useRef<TIswPaymentWebView>(null);

  const navigator = useCallback(
    (navParams?: {transRef: string; amount: number}) => {
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
      amount: amount,
      transRef: transactionRef,
    });
  };

  return (
    <ScreenLayout style={styles.container}>
      {params.merchantCode ? (
        <IswPaymentWebView
          amount={amount}
          ref={IswWebViewRef}
          currency={currency}
          mode={mode as IswTestMode}
          autoStart={autoStart}
          customer={{
            email: customerEmail,
            name: customerName,
            id: customerId,
          }}
          indicatorColor={colors.blue[100]}
          payItem={{id: payItemId}}
          merchantCode={merchantCode}
          onCompleted={handleCallback}
          transactionReference={transactionRef}
          checkoutUrl={Config.ISW_WEB_CHECKOUT_URL}
        />
      ) : null}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: (0),
  },
});
