import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AppContextType,
  User,
  Category,
  Wallet,
  Reminder,
  AuthResult,
} from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const SAMPLE_CATEGORIES: Category[] = [
  { id: "cat-1", name: "حقوق", color: "#10b981" },
  { id: "cat-2", name: "خرده فروشی", color: "#06b6d4" },
  { id: "cat-3", name: "طلب", color: "#8b5cf6" },
  { id: "cat-4", name: "ماشین", color: "#ef4444" },
  { id: "cat-5", name: "صندلی گیمینگ", color: "#f59e0b" },
  { id: "cat-6", name: "خرید لباس", color: "#ec4899" },
];

const WALLET_ID = "wallet-1";
const SAMPLE_WALLETS: Wallet[] = [
  { id: WALLET_ID, name: "حساب بانکی اصلی", balance: 0 },
  { id: "wallet-2", name: "کیف پول نقدی", balance: 0 },
  { id: "wallet-3", name: "کارت اعتباری", balance: 0 },
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : SAMPLE_CATEGORIES;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem("wallets");
    return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : SAMPLE_WALLETS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem("users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("currentUser", JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem("categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("wallets", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("reminders", JSON.stringify(reminders)); }, [reminders]);

  const register = (username: string, password: string): AuthResult => {
    if (users.find((u) => u.username === username)) {
      return { success: false, message: "این نام کاربری قبلا ثبت شده است" };
    }
    const newUser: User = { id: uuidv4(), username, password };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: "ثبت‌ نام موفق" };
  };

  const login = (username: string, password: string): AuthResult => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, message: "ورود موفق" };
    }
    return { success: false, message: "نام کاربری یا رمز عبور اشتباه است" };
  };

  const logout = (): void => setCurrentUser(null);

  const addCategory = (category: Omit<Category, "id">): void => {
    setCategories([...categories, { id: uuidv4(), ...category }]);
  };

  const deleteCategory = (id: string): void => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const addWallet = (wallet: Omit<Wallet, "id">): void => {
    setWallets([...wallets, { id: uuidv4(), ...wallet, balance: 0 }]);
  };

  const deleteWallet = (id: string): void => {
    setWallets(wallets.filter((w) => w.id !== id));
  };

  const updateWalletBalance = (id: string, newBalance: number): void => {
    setWallets(wallets.map((w) => (w.id === id ? { ...w, balance: newBalance } : w)));
  };

  const transferMoney = (fromWalletId: string, toWalletId: string, amount: number): void => {
    const fromWallet = wallets.find((w) => w.id === fromWalletId);
    const toWallet = wallets.find((w) => w.id === toWalletId);
    if (fromWallet && toWallet) {
      updateWalletBalance(fromWalletId, fromWallet.balance - amount);
      updateWalletBalance(toWalletId, toWallet.balance + amount);
    }
  };

  const addReminder = (reminder: Omit<Reminder, "id">): void => {
    setReminders([...reminders, { id: uuidv4(), ...reminder }]);
  };

  const deleteReminder = (id: string): void => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const value: AppContextType = {
    users,
    currentUser,
    categories,
    wallets,
    reminders,
    register,
    login,
    logout,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
    updateWalletBalance,
    transferMoney,
    addReminder,
    deleteReminder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};