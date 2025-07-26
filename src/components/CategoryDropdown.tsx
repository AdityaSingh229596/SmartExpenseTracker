import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { useTheme, Menu, Divider } from 'react-native-paper';
import { TransactionCategory } from '../types';

interface CategoryDropdownProps {
  onSelect: (category: TransactionCategory) => void;
  value: string;
  error?: boolean;
}

const categories: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'bills',
  'health',
  'education',
  'income',
  'other',
];

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onSelect, value, error }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const getDisplayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={openMenu}
        style={[
          styles.dropdown,
          { 
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.surface,
          }
        ]}
      >
        <Text style={{ color: value ? colors.text : colors.textSecondary }}>
          {value ? getDisplayName(value) : 'Select Category'}
        </Text>
      </TouchableOpacity>

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <View style={styles.anchor} />
        }
        contentStyle={{ backgroundColor: colors.surface }}
      >
        {categories.map((category, index) => (
          <React.Fragment key={category}>
            <Menu.Item
              onPress={() => {
                onSelect(category);
                closeMenu();
              }}
              title={getDisplayName(category)}
            />
            {index < categories.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    justifyContent: 'center',
    height: 56,
  },
  anchor: {
    width: 1,
    height: 1,
  },
});

export default CategoryDropdown;