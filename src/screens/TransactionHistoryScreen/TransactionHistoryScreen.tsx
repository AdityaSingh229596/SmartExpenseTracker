import React, { useState } from 'react';
import { View, StyleSheet, FlatList ,Text } from 'react-native';
import { useTheme, Searchbar, Card } from 'react-native-paper';
import { useAppSelector } from '../../store/hooks/hooks';
import TransactionItem from '../../components/TransactionItem';
import { Transaction } from '../../types';
import { spacing } from '../../themes/spacing';

const TransactionHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { transactions } = useAppSelector(state => state.transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');

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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            filter === 'credit' && { color: colors.success, fontWeight: 'bold' }
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
            <TransactionItem transaction={item} />
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