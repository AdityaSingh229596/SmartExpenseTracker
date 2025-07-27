import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Card, Text, FAB } from 'react-native-paper'; // Add FAB to imports
import PieChartComponent from '../../components/PieChartComponent';
import TransactionItem from '../../components/TransactionItem';
import { RootStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks';
import { spacing } from '../../themes/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { addTransaction ,addTransactionInBulk } from '../../store/slices/transactionsSlice';
type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { transactions } = useAppSelector(state => state.transactions);
  const bankKeywords = ['HDFCBK', 'ICICIBK', 'AXISBK', 'SBIUPI', 'CITIBK','CANBNK', 'PNB', 'BOI', 'BOB', 'UBI', 'IDFCBK', 'KOTAKBK', 'YESBK', 'RBLBK'];
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch=useAppDispatch();

  useEffect(() => {
    // Fetch bank SMS messages when the component mounts
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBankSMS();
    });
    // Cleanup function to remove the listener
    return unsubscribe;
    } 
  , [navigation]);

  const fetchBankSMS = () => {
    const filter = {
      box: 'inbox',
      maxCount: 500,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.error('SMS List Error:', fail);
        setLoading(false);
      },
      (count: number, smsList: any) => {
        const parsed = JSON.parse(smsList);
         console.log('SMS parsed:', parsed);
        const financeMessages = parsed
          .filter((msg: any) =>
            bankKeywords.some((bank) => msg.address.includes(bank))
          )
          .map(parseBankSMS)
          .filter(Boolean);
        setMessages(financeMessages);
        dispatch(addTransactionInBulk(financeMessages));
        setLoading(false);
      }
    );
  };

  console.log('Parsed Messages:', messages);

  const parseBankSMS = (msg: any) => {
  const text = msg.body;

  const amountRegex = /(?:Rs\.?|INR)\s?([\d,]+\.?\d{0,2})/i;
  const creditRegex = /credited/i;
  const debitRegex = /debited|spent|withdrawn/i;
  const dateRegex = /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/;

  const amountMatch = text.match(amountRegex);
  const type = creditRegex.test(text)
    ? 'credit'
    : debitRegex.test(text)
    ? 'debit'
    : 'unknown';

  if (!amountMatch || type === 'unknown') return null;

  const parsedDate = moment(msg.date).format('DD-MM-YYYY');

  return {
    id: uuid.v4(),
    amount: parseFloat(amountMatch[1].replace(/,/g, '')),
    type,
    date: parsedDate,
    bankName: getBankFromSender(msg.address),
    description: text.slice(0, 120), // Short description preview
    category: 'other', // You can later apply NLP or rules to detect actual category
    isFromSms: true,
  };
};

const getBankFromSender = (sender: string) => {
  if (sender.includes('HDFC')) return 'HDFC Bank';
  if (sender.includes('ICICI')) return 'ICICI Bank';
  if (sender.includes('AXIS')) return 'Axis Bank';
  if (sender.includes('SBIUPI')) return 'SBI Bank';
  if (sender.includes('CITI')) return 'Citi Bank';
  if (sender.includes('CANBNK')) return 'Canara Bank';
  return 'Unknown Bank';
};


  // Calculate monthly expenses
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = transactions
    .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  // Get last 5 transactions
  const lastTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.scrollView, { padding: spacing.medium }]}>
        {/* Your existing card components */}
        {/* <Card style={[styles.card, { marginBottom: spacing.medium }]}>
          <Card.Content>
            <Text style={{ color: colors.primary }}>Total Balance</Text>
            <Text style={styles.balanceText}>₹{totalBalance.toLocaleString()}</Text>
          </Card.Content>
        </Card> */}

        <Card style={[styles.card, { marginBottom: spacing.medium }]}>
          <Card.Content>
            <Text style={{ color: colors.primary }}>Monthly Expenses</Text>
            <Text style={styles.expenseText}>₹{monthlyExpenses.toLocaleString()}</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { marginBottom: spacing.medium }]}>
          <Card.Content>
            <Text style={{ color: colors.primary }}>Spending by Category</Text>
            <PieChartComponent transactions={transactions} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={{ color: colors.primary, marginBottom: spacing.small }}>
              Recent Transactions
            </Text>
            {lastTransactions.length > 0 ? (
              lastTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onPress={() => navigation.navigate('TransactionHistory')}
                />
              ))
            ) : (
              <Text style={{ color: colors.secondary }}>
                No transactions yet
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Expense FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense')}
        color={colors.onPrimary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Needed for absolute positioning of FAB
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 8,
    elevation: 2,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  expenseText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#B00020',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;