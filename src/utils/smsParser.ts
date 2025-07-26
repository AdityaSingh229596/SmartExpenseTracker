// import { Transaction } from '../types';

// const BANK_SENDERS = ['AXISBK', 'HDFCBK', 'ICICIB', 'SBIBK', 'YESB'];

// export const parseSms = (smsText: string): Transaction | null => {
//   // Check if SMS is from a known bank
//   const isBankSms = BANK_SENDERS.some(sender => 
//     smsText.toUpperCase().includes(sender)
//   );
  
//   if (!isBankSms) return null;

//   // Extract amount
//   const amountMatch = smsText.match(/Rs\.?(\d+(?:,\d+)*(?:\.\d+)?)/i);
//   if (!amountMatch) return null;
  
//   const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  
//   // Determine transaction type
//   const isCredit = /credited|deposited|received/i.test(smsText);
//   const isDebit = /debited|spent|paid/i.test(smsText);
  
//   // Extract date
//   const dateMatch = smsText.match(/(\d{2}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/);
//   const date = dateMatch ? new Date(dateMatch[0]) : new Date();
  
//   // Extract bank name
//   const bankMatch = smsText.match(new RegExp(BANK_SENDERS.join('|'), 'i'));
//   const bankName = bankMatch ? bankMatch[0] : 'Unknown Bank';
  
//   return {
//     id: `sms-${Date.now()}`,
//     amount,
//     type: isCredit ? 'credit' : isDebit ? 'debit' : 'other',
//     date: date.toISOString(),
//     bankName,
//     description: smsText,
//     category: isDebit ? 'expense' : 'income',
//     isFromSms: true,
//   };
// };