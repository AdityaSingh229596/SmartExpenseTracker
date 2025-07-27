import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Transaction } from './transaction'; // Adjust the import path as necessary

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  AddExpense: { transactionItem?: Transaction };
  TransactionHistory: undefined;
  SplashScreen: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;