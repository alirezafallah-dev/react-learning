import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../types";

const LOCAL_STORAGE_KEY = "transactions";
const WALLET_ID = "wallet-1";

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: "t-1", title: "حقوق ماهانه", amount: 30000000, type: "income", category: "حقوق", walletId: WALLET_ID, date: "2026-08-05", description: "حقوق مرداد ماه", createdAt: "2026-08-05T10:00:00.000Z" },
  { id: "t-2", title: "درآمد خرده فروشی", amount: 10000000, type: "income", category: "خرده فروشی", walletId: WALLET_ID, date: "2026-08-22", description: "فروش محصولات فروشگاه", createdAt: "2026-08-22T10:00:00.000Z" },
  { id: "t-3", title: "طلب قبلی", amount: 7000000, type: "income", category: "طلب", walletId: WALLET_ID, date: "2026-08-26", description: "دریافت طلب از مشتری", createdAt: "2026-08-26T10:00:00.000Z" },
  { id: "t-4", title: "خرج ماشین", amount: 6000000, type: "expense", category: "ماشین", walletId: WALLET_ID, date: "2026-08-11", description: "تعمیر و نگهداری خودرو", createdAt: "2026-08-11T10:00:00.000Z" },
  { id: "t-5", title: "خرید صندلی گیمینگ", amount: 17000000, type: "expense", category: "صندلی گیمینگ", walletId: WALLET_ID, date: "2026-08-15", description: "صندلی گیمینگ حرفه‌ای", createdAt: "2026-08-15T10:00:00.000Z" },
  { id: "t-6", title: "خرید لباس", amount: 7400000, type: "expense", category: "خرید لباس", walletId: WALLET_ID, date: "2026-08-23", description: "خرید لباس های فصل", createdAt: "2026-08-23T10:00:00.000Z" },
];

const loadTransactions = (): Transaction[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: Transaction[] = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return SAMPLE_TRANSACTIONS;
};

const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
};

type TransactionPayload = Omit<Transaction, "id" | "createdAt">;

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: loadTransactions(),
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionPayload>) => {
      const newTransaction: Transaction = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.unshift(newTransaction);
      saveTransactions(state);
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const newState = state.filter((t) => t.id !== action.payload);
      saveTransactions(newState);
      return newState;
    },
  },
});

export const { addTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;