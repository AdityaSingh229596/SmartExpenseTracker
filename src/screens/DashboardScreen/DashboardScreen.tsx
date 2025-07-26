import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Card, Text, FAB } from 'react-native-paper'; // Add FAB to imports
import PieChartComponent from '../../components/PieChartComponent';
import TransactionItem from '../../components/TransactionItem';
import { RootStackParamList } from '../../types';
import { useAppSelector } from '../../store/hooks/hooks';
import { spacing } from '../../themes/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { transactions } = useAppSelector(state => state.transactions);
  const { banks } = useAppSelector(state => state.banks);

  // Calculate total balance
  const totalBalance = banks.reduce((sum, bank) => sum + bank.balance, 0);

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
        <Card style={[styles.card, { marginBottom: spacing.medium }]}>
          <Card.Content>
            <Text style={{ color: colors.primary }}>Total Balance</Text>
            <Text style={styles.balanceText}>₹{totalBalance.toLocaleString()}</Text>
          </Card.Content>
        </Card>

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