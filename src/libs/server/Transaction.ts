import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

type TransactionStatus = 'SUCCESSFUL' | 'FAILED' | 'PENDING'

interface TransactionParams {
  reference: string;
  amount: number;
  charge: number;
  date: string;
  status:TransactionStatus;
}

class TransactionService {
  private firestore: typeof firestore;
  private ISW_API_URL = 'https://api.interswitch.com/transaction/verify'; // Replace with actual endpoint
  private ISW_API_KEY = 'YOUR_ISW_API_KEY';

  constructor(firestoreModule: typeof firestore) {
    this.firestore = firestoreModule;
  }

  async initializeTransaction(amount: number, charge: number): Promise<TransactionParams> {
    const reference = `TRX_${Date.now()}`;
    const transaction: TransactionParams = {
      reference,
      amount,
      charge,
      date: new Date().toISOString(),
      status: 'PENDING',
    };
    await this.firestore().collection('transactions').doc(reference).set(transaction);
    return transaction;
  }

  async verifyTransaction(reference: string): Promise<TransactionParams | null> {
    try {
      // const response = await axios.post(
      //   this.ISW_API_URL,
      //   { reference },
      //   { headers: { Authorization: `Bearer ${this.ISW_API_KEY}` } }
      // );

      const newStatus = 'FAILED';
      // const newStatus = response.data.status as TransactionStatus;
      await this.firestore().collection('transactions').doc(reference).update({ status: newStatus });
      const updatedTransaction = await this.firestore().collection('transactions').doc(reference).get();
      return updatedTransaction.data() as TransactionParams;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return null;
    }
  }

  async getAllTransactions(): Promise<TransactionParams[]> {
    const snapshot = await this.firestore().collection('transactions').get();
    return snapshot.docs.map(doc => doc.data() as TransactionParams);
  }
  async getTotalTransactionsAmountByStatus(status:TransactionStatus): Promise<number> {
    const snapshot = await this.firestore().collection('transactions').where('status', '==', status).get();
    return snapshot.docs.reduce((total, doc) => total + (doc.data() as TransactionParams).amount, 0);
  }
}

const transactionService = new TransactionService(firestore);
export default transactionService;
