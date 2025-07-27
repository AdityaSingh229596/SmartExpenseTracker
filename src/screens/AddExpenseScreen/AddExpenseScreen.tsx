import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useTheme, TextInput, Button, HelperText ,ActivityIndicator} from 'react-native-paper';
import { Formik, FormikProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
import CategoryDropdown from '../../components/CategoryDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '../../store/hooks/hooks';
import { addTransaction, updateTransaction } from '../../store/slices/transactionsSlice';
import { RootStackParamList, Transaction } from '../../types';
import { spacing } from '../../themes/spacing';
import moment from 'moment';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
});

type AddExpenseScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;
  route?: {
    params?: {
      transactionItem?: Transaction;
    };
  };
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({navigation, route}) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const transactionItem = route?.params?.transactionItem;
  const [loading, setLoading] = React.useState(false);
  console.log('Transaction Item:', transactionItem?.date);
  const initialValues = React.useMemo(() => ({
    amount: transactionItem ? transactionItem.amount.toString() : '',
    category: transactionItem ? transactionItem.category : '',
    description: transactionItem ? transactionItem.description : '',
    date: transactionItem ? moment(transactionItem.date, 'DD-MM-YYYY').toDate() : moment().toDate(),
  }), []);
  
  const handleSubmit = (values: {
    amount: string;
    category: string;
    description: string;
    date: Date;
  }) => {
    setLoading(true);
  
    try {
      if (transactionItem) {
        const updatedTransaction: Transaction = {
          ...transactionItem,
          amount: parseFloat(values.amount),
          date: moment(values.date).format('DD-MM-YYYY'),
          description: values.description,
          category: values.category as Transaction['category'],
        };
        dispatch(updateTransaction(updatedTransaction));
        navigation.replace('TransactionHistory');
      } else {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          amount: parseFloat(values.amount),
          type: 'debit',
          date: moment(values.date).format('DD-MM-YYYY'),
          bankName: 'Manual Entry',
          description: values.description,
          category: values.category as Transaction['category'],
          isFromSms: false,
        };
        dispatch(addTransaction(newTransaction));
        navigation.replace('Dashboard');
      }
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
          <ActivityIndicator animating={true} size="large" style={{ marginTop: 24 }} color={colors.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView>
      <KeyboardAvoidingView style={[styles.container, { padding: spacing.medium }]}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // This allows the form to reinitialize when initialValues change
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
                  Keyboard.dismiss();
                  setShowDatePicker(true);
                }}
                style={styles.dateButton}
              >
                {transactionItem?.date ? transactionItem?.date : moment(values.date).format('DD-MM-YYYY') }
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={transactionItem?.date ? moment(transactionItem.date, 'DD-MM-YYYY').toDate() : values.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    console.log('Selected date:', selectedDate);
                    if (selectedDate) {
                      setFieldValue('date', selectedDate);
                    }
                  }}
                />
              )}

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submitButton}
              >
                {transactionItem ? 'Update Expense' : 'Add Expense'}
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