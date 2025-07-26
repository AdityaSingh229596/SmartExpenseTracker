import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bank } from '../../types';

interface BanksState {
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

const initialState: BanksState = {
  banks: [],
  loading: false,
  error: null,
};

export const banksSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    addBank: (state, action: PayloadAction<Bank>) => {
      // Check if bank already exists
      const existingIndex = state.banks.findIndex(
        bank => bank.name === action.payload.name
      );
      
      if (existingIndex >= 0) {
        // Update existing bank
        state.banks[existingIndex] = action.payload;
      } else {
        // Add new bank
        state.banks.push(action.payload);
      }
    },
    updateBankBalance: (
      state, 
      action: PayloadAction<{bankName: string; newBalance: number}>
    ) => {
      const { bankName, newBalance } = action.payload;
      const bank = state.banks.find(b => b.name === bankName);
      if (bank) {
        bank.balance = newBalance;
        bank.lastUpdated = new Date().toISOString();
      }
    },
    removeBank: (state, action: PayloadAction<string>) => {
      state.banks = state.banks.filter(bank => bank.id !== action.payload);
    },
    setBanks: (state, action: PayloadAction<Bank[]>) => {
      state.banks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addBank, 
  updateBankBalance, 
  removeBank, 
  setBanks,
  setLoading,
  setError
} = banksSlice.actions;

export const selectBanks = (state: { banks: BanksState }) => state.banks.banks;
export const selectTotalBalance = (state: { banks: BanksState }) => 
  state.banks.banks.reduce((sum, bank) => sum + bank.balance, 0);
export const selectBanksLoading = (state: { banks: BanksState }) => 
  state.banks.loading;
export const selectBanksError = (state: { banks: BanksState }) => 
  state.banks.error;

export default banksSlice.reducer;