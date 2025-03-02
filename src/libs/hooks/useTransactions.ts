import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import transactionService from '../server/Transaction';
import {useAuthContext} from '../context';
import { Config } from '../config/keys';

type PaymentInfo = {
  deviceId?: string;
  unitAmount?: number;
  customerName?: string;
  email?: string;
  date?: string;
  convenienceFee?: number;
};

const defaultPaymentInformation = {
  deviceId: undefined,
  unitAmount: undefined,
  customerName: undefined,
  email: undefined,
  date: undefined,
  convenienceFee: undefined,
};

export const useTransactions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isRecharge, setIsRecharge] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(
    defaultPaymentInformation,
  );
  const {user} = useAuthContext();
  const navigation = useNavigation<any>();
  const proceedToPreview = async (unit: number) => {
    const payInfo = {
      deviceId: user?.powerBoxId,
      unitAmount: unit,
      customerName: user?.firstName,
      email: user?.email,
      date: new Date().toISOString().split('T')[0],
      convenienceFee: 100, // Should be reviewed
    };
    setPaymentInfo(payInfo);
  };

  function viewTransactionDetails() {
    closeModal();
    navigation.navigate('Transactions');
  }

  const proceedToPay = async () => {
    try {
      setIsRecharge(true);
      if (
        paymentInfo.unitAmount &&
        paymentInfo.customerName &&
        paymentInfo.email &&
        paymentInfo.unitAmount &&
        paymentInfo.convenienceFee && user?.userId
      ) {
        const {amount, reference} =
          await transactionService.initializeTransaction(
            paymentInfo.unitAmount,
            paymentInfo.convenienceFee,
            user.userId
          );
        closeModal();
        navigation.navigate('Payment', {
          merchantCode: Config.merchantCode,
          payItemId: Config.payItemId,
          transactionRef: reference,
          amount: amount * 100,
          currency: '566',
          mode: 'LIVE',
          customerName: paymentInfo.customerName,
          customerId:  user.userId,
          customerEmail: paymentInfo.email,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        showMessage({
          message: error.message,
          type: 'danger',
        });
      }
    } finally {
      setIsRecharge(false);
    }
  };

  function closeModal () {
    setOpenModal(false);
    setPaymentInfo(defaultPaymentInformation);
  }

  const displayModal = ()=>{
    setOpenModal(true);
  };
  return {
    openModal,
    isRecharge,
    closeModal,
    paymentInfo,
    proceedToPay,
    displayModal,
    proceedToPreview,
    viewTransactionDetails,
    removeParams:navigation.setParams,
  };
};
