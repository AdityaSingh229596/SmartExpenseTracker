import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store'; 
import AppNavigator from './src/navigations/AppNavigator';
import { theme } from './src/themes';
// import { initDatabase, loadTransactions } from './src/db/index';
import { setTransactions } from './src/store/slices/transactionsSlice';
import { PersistGate } from 'redux-persist/integration/react';

// import { getInitialSms } from './src/services/smsReader';
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        // await initDatabase();

        // Load saved transactions from database
        // const savedTransactions = await loadTransactions();
        // store.dispatch(setTransactions(savedTransactions));

        // Start SMS listener and load initial SMS
        // await getInitialSms(store.dispatch);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <PaperProvider theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors } }}>
          <AppNavigator />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;