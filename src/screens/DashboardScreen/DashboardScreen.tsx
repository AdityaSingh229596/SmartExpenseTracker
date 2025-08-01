import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Card, Text, FAB } from 'react-native-paper';
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
  const [loading, setLoading] = useState(false);
  const dispatch=useAppDispatch();
  const { isAllPermissionsGranted } = useAppSelector(state => state.global);

  useEffect(() => {
    let unsubscribe;
    if (isAllPermissionsGranted){
       unsubscribe = navigation.addListener('focus', () => {
        fetchBankSMS();
      });
    }   
    return unsubscribe;
    } 
  , [navigation, isAllPermissionsGranted]);

  const fetchBankSMS = () => {
    const filter = {
      box: 'inbox',
      maxCount: 100,
    };
  
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.error('SMS List Error:', fail);
        setLoading(false);
      },
      (count: number, smsList: any) => {
        const parsed = JSON.parse(smsList);
        const existingSmsIds = transactions
          .filter(t => t.isFromSms)
          .map(t => t.description?.slice(0, 60)); 
  
        const financeMessages = parsed
          .filter((msg: any) => 
            bankKeywords.some((bank) => msg.address.includes(bank)) &&
            !existingSmsIds.includes(msg.body.slice(0, 60)) 
          )
          .map(parseBankSMS)
          .filter(Boolean);
  
        if (financeMessages.length > 0) {
          dispatch(addTransactionInBulk(financeMessages));
        }
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
    description: text.slice(0, 60), 
    category: 'other', 
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
  const currentMonth = moment().month()+1;
  const monthlyExpenses = transactions
    .filter(t => t.type === 'debit' &&  moment(t.date,"DD-MM-YYYY").format('M') === currentMonth.toString())
    .reduce((sum, t) => sum + t.amount, 0);

  // console.log('Monthly Expenses:', monthlyExpenses , transactions);  
  // Get last 5 transactions
  const lastTransactions = [...transactions].reverse().slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.scrollView, { padding: spacing.medium }]}>
        {/* <Card style={[styles.card, { marginBottom: spacing.medium }]}>
          <Card.Content>
            <Text style={{ color: colors.primary }}>Total Balance</Text>
            <Text style={styles.balanceText}>₹ 0</Text>
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
        <Card style={[styles.card , { marginBottom: 40}]}>
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

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense')}
        color={colors.onPrimary}
      />
      {/* Loading Indicator */}
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.primary, marginBottom: spacing.small }} >Loading data...</Text>
        </View>
      )}
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