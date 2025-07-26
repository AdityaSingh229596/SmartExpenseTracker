import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import transactionsReducer from './slices/transactionsSlice';
import banksReducer from './slices/banksSlice';
import globalReducer from './slices/globalSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  // Optionally, you can whitelist or blacklist specific reducers
  // whitelist: ['transactions', 'banks'],
  // blacklist: ['global'],
};

// Create persisted reducers
const persistedTransactionsReducer = persistReducer(
  { ...persistConfig, key: 'transactions' },
  transactionsReducer
);

const persistedBanksReducer = persistReducer(
  { ...persistConfig, key: 'banks' },
  banksReducer
);

const persistedGlobalReducer = persistReducer(
  { ...persistConfig, key: 'global' },
  globalReducer
);

export const store = configureStore({
  reducer: {
    transactions: persistedTransactionsReducer,
    banks: persistedBanksReducer,
    global: persistedGlobalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;