import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {Config} from '../config/keys';
import {IPGTransactionVerification} from '../types';

export type TransactionStatus = 'SUCCESSFUL' | 'FAILED' | 'PENDING';

const ISW_RESPONSES = {
  '10': 'SUCCESSFUL',
  '11': 'SUCCESSFUL',
  '00': 'SUCCESSFUL',
  '09': 'PENDING',
  Z0: 'PENDING',
};

export interface TransactionParams {
  reference: string;
  amount: number;
  charge: number;
  date: string;
  userId: string;
  loadStatus:TransactionStatus
  status: TransactionStatus;
}

class TransactionService {
  private firestore: typeof firestore;

  constructor(firestoreModule: typeof firestore) {
    this.firestore = firestoreModule;
  }

  async initializeTransaction(
    amount: number,
    charge: number,
    userId: string,
  ): Promise<TransactionParams> {
    const reference = `PWR_BX_${Date.now()}`;
    const transaction: TransactionParams = {
      reference,
      amount,
      charge,
      userId,
      date: new Date().toISOString(),
      status: 'PENDING',
      loadStatus: 'PENDING',
    };
    await this.firestore()
      .collection('transactions')
      .doc(reference)
      .set(transaction);
    return transaction;
  }

  async verifyTransaction(
    reference: string,
    amount: string,
    deviceConnectivity: 'offline' | 'online',
  ): Promise<{
    reference: string;
    amount: string;
    status: TransactionStatus | string;
    loadStatus: TransactionStatus;
  }> {
    const response = await axios.get<IPGTransactionVerification>(
      `${Config.ISW_SERVER_API}/collections/api/v1/gettransaction.json?merchantcode=${Config.merchantCode}&transactionreference=${reference}&amount=${amount}`,
    );
    const status = ISW_RESPONSES[response.data.ResponseCode] ?? 'FAILED';
    const loadStatus =
      deviceConnectivity === 'offline' && status === 'SUCCESSFUL'
        ? 'PENDING'
        : deviceConnectivity === 'online' && status === 'SUCCESSFUL'
        ? 'SUCCESSFUL'
        : 'PENDING';

    await this.firestore()
      .collection('transactions')
      .doc(reference)
      .update({status, loadStatus});
    return {
      amount,
      status,
      reference,
      loadStatus,
    };
  }

  async updateLoadStatus(
    reference: string,
    loadStatus: TransactionStatus,
  ): Promise<boolean> {

    await this.firestore()
      .collection('transactions')
      .doc(reference)
      .update({loadStatus});
    return true;
  }

  async getTransactionByReference(
    reference: string,
  ): Promise<TransactionParams | null> {
    const transactionRef = firestore()
      .collection('transactions')
      .doc(reference);
    const docSnapshot = await transactionRef.get();

    if (!docSnapshot.exists) {
      console.error(`Transaction with reference ${reference} not found.`);
      return null;
    }
    return docSnapshot.data() as TransactionParams;
  }

  async getAllTransactions(userId:string, source?:'server'|'cache'|'default'): Promise<TransactionParams[]> {
    const snapshot = await this.firestore().collection('transactions')
    .where('userId', '==', userId)
    // .orderBy('date', 'desc')
    .get({source: source ?? 'default'})
    return snapshot.docs.map(doc => doc.data() as TransactionParams);
  }
  async getTotalTransactionsAmountByStatus(
    status: TransactionStatus,
  ): Promise<number> {
    const snapshot = await this.firestore()
      .collection('transactions')
      .where('status', '==', status)
      .get();
    return snapshot.docs.reduce(
      (total, doc) => total + (doc.data() as TransactionParams).amount,
      0,
    );
  }
}

const transactionService = new TransactionService(firestore);
export default transactionService;
