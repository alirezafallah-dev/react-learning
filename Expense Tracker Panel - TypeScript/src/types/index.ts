export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export interface Reminder {
  id: string;
  title: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  description: string;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  walletId: string;
  date: string;
  description: string;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
}

export interface AppContextType {
  users: User[];
  currentUser: User | null;
  categories: Category[];
  wallets: Wallet[];
  reminders: Reminder[];
  register: (username: string, password: string) => AuthResult;
  login: (username: string, password: string) => AuthResult;
  logout: () => void;
  addCategory: (category: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, "id">) => void;
  deleteWallet: (id: string) => void;
  updateWalletBalance: (id: string, newBalance: number) => void;
  transferMoney: (fromWalletId: string, toWalletId: string, amount: number) => void;
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  deleteReminder: (id: string) => void;
}

export interface TransactionFormData {
  title: string;
  amount: string;
  type: TransactionType;
  category: string;
  walletId: string;
  date: string;
  description: string;
}

export interface ReminderFormData {
  title: string;
  amount: string;
  frequency: "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  description: string;
}

export interface WalletFormData {
  name: string;
}

export interface TransferFormData {
  fromWalletId: string;
  toWalletId: string;
  amount: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
}

export interface RootState {
  transactions: Transaction[];
}

export interface Stats {
  income: number;
  expense: number;
  balance: number;
  totalWalletBalance: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  date: string;
  income: number;
  expense: number;
}