import React from 'react';
import { View, StyleSheet, TouchableOpacity ,Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Transaction } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing } from '../themes/spacing';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const { colors } = useTheme();
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return 'restaurant';
      case 'transport':
        return 'directions-car';
      case 'shopping':
        return 'shopping-cart';
      case 'entertainment':
        return 'movie';
      case 'bills':
        return 'receipt';
      case 'health':
        return 'local-hospital';
      case 'education':
        return 'school';
      case 'income':
        return 'attach-money';
      default:
        return 'payment';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, { paddingVertical: spacing.small }]}>
        <View style={styles.iconContainer}>
          <Icon
            name={getCategoryIcon(transaction.category)}
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.description, { color: colors.onSurface }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.details, { color: colors.secondary }]}>
            {new Date(transaction.date).toLocaleDateString()} • {transaction.bankName}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            {
              color: transaction.type === 'credit' ? colors.success : colors.error,
            },
          ]}
        >
          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionItem;