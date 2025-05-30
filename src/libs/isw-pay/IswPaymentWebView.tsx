import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import {
  WebView,
  type WebViewNavigation,
  type WebViewMessageEvent,
} from 'react-native-webview';
import { getHtmlInputsFields, getWebCheckoutHtmlContent } from './utils';
import { BackDrop } from '@/components/common/modal/BackDrop';
import { IswPaymentWebViewProps, IswWebViewRefMethods } from './types';

const DefaultRedirectUrl = 'https://newwebpay.interswitchng.com/';

const IswPaymentWebView: React.ForwardRefRenderFunction<
  IswWebViewRefMethods,
  IswPaymentWebViewProps
> = (
  {
    trnxRef,
    mode,
    onCompleted,
    payItem,
    accessToken,
    merchantCode,
    tokeniseCard,
    amount,
    currency = 566,
    customer,
    autoStart,
    onWebMessage,
    checkoutUrl,
    splitAccounts,
    redirectUrl = DefaultRedirectUrl,
  },
  ref
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (autoStart) {
      setOpenModal(true);
    }
  }, [autoStart]);

  useImperativeHandle(ref, () => ({
    start() {
      setOpenModal(true);
    },
    end() {
      setOpenModal(false);
    },
  }));

  const inputs = getHtmlInputsFields({
    amount,
    currency,
    mode,
    payItem,
    accessToken,
    customer,
    merchantCode,
    tokeniseCard,
    trnxRef,
    redirectUrl,
    splitAccounts,
  });

  const htmlContent = getWebCheckoutHtmlContent(checkoutUrl, inputs);

  const onMessageHandler = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent?.data;
    const webResponse = JSON.parse(data);
    if (onWebMessage) {
      onWebMessage(webResponse);
    }
  };

  const handleNavigationStateChange = (state: WebViewNavigation) => {
    if (state.url === redirectUrl) {
      onCompleted();
    }
  };


  return (
    <>
      {openModal ? (
        <WebView
          ref={webViewRef}
          cacheMode={'LOAD_DEFAULT'}
          onMessage={onMessageHandler}
          source={{ html: htmlContent }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
          }}
          style={[style.flex]}
          onNavigationStateChange={handleNavigationStateChange}
        />
       ) : null}
      <BackDrop  isLoading={isLoading} />
    </>
  );
};
export default forwardRef(IswPaymentWebView);

const style = StyleSheet.create({
  flex: {
    flex: 1,
    // marginTop: 24,
  },
});
