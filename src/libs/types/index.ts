export type IPGTransactionVerification = {
  Amount: number;
  CardNumber: string;
  MerchantReference: string;
  Channel: string;
  SplitAccounts: any[];
  TransactionDate: string;
  ResponseCode: '10' | '11' | '00' | '09' | 'Z0';
  ResponseDescription: string;
  BankCode: string;
  PaymentId: number;
  RemittanceAmount: number;
};
