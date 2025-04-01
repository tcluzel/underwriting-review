export interface Document {
  type: 'application' | 'id' | 'bankStatements' | 'processingStatements' | 'voidedCheck';
  status: 'missing' | 'received' | 'verified';
  required: boolean;
}

export interface Address {
  dba: string;
  address: string;
  source: string;
  validationUrl: string;
  status: 'pending' | 'verified' | 'failed';
}

export interface BusinessRepresentative {
  name: string;
  source: string;
  validationUrl: string;
  status: 'pending' | 'verified' | 'failed';
}

export interface BankAccount {
  accountNumber: string;
  bankName: string;
  dba: string;
  source: string;
  status: 'pending' | 'verified' | 'failed';
}

export interface Transaction {
  date: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  isHighRisk: boolean;
}

export interface BankStatement {
  date: string;
  beginningBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  endingBalance: number;
  largeTransactions: Transaction[];
}

export interface TransactionVolume {
  reported: number;
  actual: number;
  aligned: boolean;
}

export interface RiskFlags {
  chargebacks: boolean;
  nsf: boolean;
  irregularDeposits: boolean;
}

export interface UnderwritingReview {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'clarification_needed';
  documents: Document[];
  addresses: Address[];
  representative: BusinessRepresentative;
  bankAccounts: BankAccount[];
  bankStatements: BankStatement[];
  transactionVolume: TransactionVolume;
  riskFlags: RiskFlags;
} 