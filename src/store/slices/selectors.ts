import { RootState } from '../index';

// Transaction selectors
export const selectRecentTransactions = (state: RootState) =>
  state.transactions.transactions.slice(0, 5);

export const selectMonthlyExpenses = (state: RootState) => {
  const currentMonth = new Date().getMonth();
  return state.transactions.transactions
    .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const selectTransactionsByCategory = (category: string) => 
  (state: RootState) =>
    state.transactions.transactions.filter(t => t.category === category);

// Bank selectors
export const selectBankByName = (name: string) => 
  (state: RootState) =>
    state.banks.banks.find(bank => bank.name === name);

export const selectPrimaryBank = (state: RootState) =>
  state.banks.banks.length > 0 ? state.banks.banks[0] : null;