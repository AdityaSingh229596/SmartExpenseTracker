import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';

interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: [],
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      console.log('Adding transaction:', action.payload);
      state.transactions.push(action.payload);
    },
    addTransactionInBulk: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = [...state.transactions, ...action.payload];
    },    
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction, setTransactions , addTransactionInBulk } = transactionsSlice.actions;
export default transactionsSlice.reducer;