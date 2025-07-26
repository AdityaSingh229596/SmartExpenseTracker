import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { useTheme } from 'react-native-paper';
import { Transaction } from '../types';

interface PieChartComponentProps {
  transactions: Transaction[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ transactions }) => {
  const { colors } = useTheme();

  // Group transactions by category and sum amounts
  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'debit') {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([key, value], index) => ({
    key,
    value,
    svg: {
      fill: [
        colors.primary,
        colors.secondary,
        colors.error,
        colors.warning,
        colors.success,
      ][index % 5],
      onPress: () => console.log('press', key),
    },
    arc: { outerRadius: '100%', padAngle: 0 },
  }));

  return (
    <View style={styles.container}>
      <PieChart
        style={styles.chart}
        data={pieData}
        innerRadius="50%"
        padAngle={0}
      />
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: item.svg.fill },
              ]}
            />
            <Text style={styles.legendText}>
              {item.key}: ₹{item.value.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 200,
  },
  chart: {
    height: 200,
    width: 200,
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default PieChartComponent;