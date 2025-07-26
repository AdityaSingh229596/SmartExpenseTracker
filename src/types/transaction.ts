export type TransactionType = 'debit' | 'credit' | 'other';
export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'education'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  bankName: string;
  description: string;
  category: TransactionCategory;
  isFromSms: boolean;
  notes?: string;
}