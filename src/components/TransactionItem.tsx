import React from 'react';
import { View, StyleSheet, Text, Animated ,TouchableOpacity} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Transaction } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing } from '../themes/spacing';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
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

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    
    return (
      <View style={styles.rightActions}>
        <RectButton
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onEdit}
        >
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <Icon name="edit" size={24} color="white" />
          </Animated.Text>
        </RectButton>
        <RectButton
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={onDelete}
        >
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <Icon name="delete" size={24} color="white" />
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.container, { paddingVertical: spacing.medium,paddingHorizontal:spacing.small, borderRadius:spacing.small , marginBottom:spacing.small}]}>
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
              {transaction.date} • {transaction.bankName}
            </Text>
          </View>

          <Text
            style={[
              styles.amount,
              {
                color: transaction.type === 'credit' ? colors.primary : colors.error,
              },
            ]}
          >
            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
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
  rightActions: {
    width: 160,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    padding: 20,
  },
});

export default TransactionItem;