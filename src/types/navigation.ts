import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  AddExpense: undefined;
  TransactionHistory: undefined;
  SplashScreen: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;