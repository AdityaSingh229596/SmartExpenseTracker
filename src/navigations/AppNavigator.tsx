import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import AddExpenseScreen from '../screens/AddExpenseScreen/AddExpenseScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen/TransactionHistoryScreen';
import DashboardScreen from '../screens/DashboardScreen/DashboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen/OnBoardingScreens';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen/SplashScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='SplashScreen'
        screenOptions={{
            headerStyle: {
            backgroundColor: colors.primary,
            },
            headerTintColor: colors.onPrimary,
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        }}
        >
        <Stack.Screen options={{headerShown: false}} name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen 
            name="AddExpense" 
            component={AddExpenseScreen} 
            options={{ title: 'Add Expense' }} 
        />
        <Stack.Screen 
            name="TransactionHistory" 
            component={TransactionHistoryScreen} 
            options={{ title: 'Transaction History' }} 
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;