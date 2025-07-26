// import SmsRetriever from 'react-native-sms-retriever';
// import { parseSms } from '../utils/smsParser';
// import { AppDispatch } from '../store';
// import { addTransaction } from '../store/slices/transactionsSlice';

// export const requestSmsPermission = async () => {
//   try {
//     const granted = await SmsRetriever.requestReadSmsPermission();
//     return granted;
//   } catch (error) {
//     console.error('Permission error:', error);
//     return false;
//   }
// };

// export const startSmsListener = (dispatch: AppDispatch) => {
//   SmsRetriever.startSmsRetriever((status) => {
//     if (status) {
//       SmsRetriever.addSmsListener((event) => {
//         const parsedTransaction = parseSms(event.message);
//         if (parsedTransaction) {
//           dispatch(addTransaction(parsedTransaction));
//         }
//       });
//     }
//   });
// };

// export const getInitialSms = async (dispatch: AppDispatch) => {
//   try {
//     const hasPermission = await requestSmsPermission();
//     if (hasPermission) {
//       const smsList = await SmsRetriever.getSms();
//       smsList.forEach(sms => {
//         const parsedTransaction = parseSms(sms.body);
//         if (parsedTransaction) {
//           dispatch(addTransaction(parsedTransaction));
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error reading initial SMS:', error);
//   }
// };