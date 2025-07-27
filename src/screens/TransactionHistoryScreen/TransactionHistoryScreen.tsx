import React, { useState } from 'react';
import { View, StyleSheet, FlatList ,Text } from 'react-native';
import { useTheme, Searchbar, Card } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks';
import TransactionItem from '../../components/TransactionItem';
import { Transaction } from '../../types';
import { spacing } from '../../themes/spacing';
import { deleteTransaction } from '../../store/slices/transactionsSlice';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp,  } from '@react-navigation/native-stack';

type TransactionHistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TransactionHistory'>;
};
const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({navigation}) => {
  const { colors } = useTheme();
  const { transactions } = useAppSelector(state => state.transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const dispatch = useAppDispatch();
  // console.log('Transactions:', transactions);

  const filteredTransactions = transactions
    .filter(t => {
      if (filter === 'debit') return t.type === 'debit';
      if (filter === 'credit') return t.type === 'credit';
      return true;
    })
    .filter(t => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reverse();

  const handleEditTransaction = (transaction: Transaction) => {
    navigation.navigate("AddExpense", { transactionItem : transaction });
    console.log('Edit transaction:', transaction);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    // Implement your delete logic here
    // For example:
    dispatch(deleteTransaction(transactionId));
    console.log('Delete transaction:', transactionId);
  };

  return (
    <View style={[styles.container, { padding: spacing.medium }]}>
      <Searchbar
        placeholder="Search transactions"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Text 
          style={[
            styles.filterText, 
            filter === 'all' && { color: colors.primary, fontWeight: 'bold' }
          ]}
          onPress={() => setFilter('all')}
        >
          All
        </Text>
        <Text 
          style={[
            styles.filterText, 
            filter === 'debit' && { color: colors.error, fontWeight: 'bold' }
          ]}
          onPress={() => setFilter('debit')}
        >
          Expenses
        </Text>
        <Text 
          style={[
            styles.filterText, 
            filter === 'credit' && { color: colors.primary, fontWeight: 'bold' }
          ]}
          onPress={() => setFilter('credit')}
        >
          Income
        </Text>
      </View>

      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionItem 
              transaction={item} 
              key={item.id}
              onEdit={() => handleEditTransaction(item)}
              onDelete={() => handleDeleteTransaction(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={{ textAlign: 'center' }}>
              No transactions found
            </Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterText: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

export default TransactionHistoryScreen;