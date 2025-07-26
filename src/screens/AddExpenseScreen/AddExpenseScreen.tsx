import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'; // Add these imports
import { useTheme, TextInput, Button, HelperText } from 'react-native-paper';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import CategoryDropdown from '../../components/CategoryDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '../../store/hooks/hooks';
import { addTransaction } from '../../store/slices/transactionsSlice';
import { RootStackParamList, Transaction } from '../../types';
import { spacing } from '../../themes/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
});

type AddExpenseScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({navigation}) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleSubmit = (values: {
    amount: string;
    category: string;
    description: string;
    date: Date;
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(values.amount),
      type: 'debit',
      date: values.date.toISOString(),
      bankName: 'Manual Entry',
      description: values.description,
      category: values.category as Transaction['category'],
      isFromSms: false,
    };
    console.log('New Transaction:', newTransaction);
    dispatch(addTransaction(newTransaction));
    navigation.navigate('Dashboard');
    Keyboard.dismiss(); // Dismiss keyboard when submitting
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={[styles.container, { padding: spacing.medium }]}>
        <Formik
          initialValues={{
            amount: '',
            category: '',
            description: '',
            date: new Date(),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }: FormikProps<{ amount: string; category: string; description: string; date: Date }>) => (
            <>
              <TextInput
                label="Amount"
                mode="outlined"
                keyboardType="numeric"
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                error={touched.amount && !!errors.amount}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.amount && !!errors.amount}>
                {errors.amount}
              </HelperText>

              <CategoryDropdown
                onSelect={(category) => setFieldValue('category', category)}
                value={values.category}
                error={touched.category && !!errors.category}
              />
              <HelperText type="error" visible={touched.category && !!errors.category}>
                {errors.category}
              </HelperText>

              <TextInput
                label="Description"
                mode="outlined"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                error={touched.description && !!errors.description}
                style={styles.input}
                multiline
              />
              <HelperText type="error" visible={touched.description && !!errors.description}>
                {errors.description}
              </HelperText>

              <Button
                mode="outlined"
                onPress={() => {
                  Keyboard.dismiss(); // Dismiss keyboard when opening date picker
                  setShowDatePicker(true);
                }}
                style={styles.dateButton}
              >
                {values.date.toLocaleDateString()}
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={values.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue('date', selectedDate);
                    }
                  }}
                />
              )}

              <Button
                mode="contained"
                onPress={() => {
                  // Keyboard.dismiss(); // Dismiss keyboard when submitting
                  handleSubmit();
                }}
                style={styles.submitButton}
              >
                Add Expense
              </Button>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: 8,
  },
  dateButton: {
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});

export default AddExpenseScreen;