// import SQLite from 'react-native-sqlite-storage';
// import { Transaction } from '../types';

// const db = SQLite.openDatabase(
//   { name: 'expense_tracker.db', location: 'default' },
//   () => console.log('Database opened'),
//   error => console.error('Database error', error)
// );

// export const initDatabase = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS transactions (
//         id TEXT PRIMARY KEY,
//         amount REAL,
//         type TEXT,
//         date TEXT,
//         bankName TEXT,
//         description TEXT,
//         category TEXT,
//         isFromSms INTEGER
//       );`
//     );
//   });
// };

// export const saveTransactions = (transactions: Transaction[]) => {
//   db.transaction(tx => {
//     transactions.forEach(transaction => {
//       tx.executeSql(
//         `INSERT OR REPLACE INTO transactions 
//         (id, amount, type, date, bankName, description, category, isFromSms) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           transaction.id,
//           transaction.amount,
//           transaction.type,
//           transaction.date,
//           transaction.bankName,
//           transaction.description,
//           transaction.category,
//           transaction.isFromSms ? 1 : 0,
//         ]
//       );
//     });
//   });
// };

// export const loadTransactions = (): Promise<Transaction[]> => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM transactions ORDER BY date DESC',
//         [],
//         (_, result) => {
//           const transactions: Transaction[] = [];
//           for (let i = 0; i < result.rows.length; i++) {
//             transactions.push(result.rows.item(i));
//           }
//           resolve(transactions);
//         },
//         (_, error) => {
//           reject(error);
//           return false;
//         }
//       );
//     });
//   });
// };