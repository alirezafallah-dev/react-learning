import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionsSlice";
import { RootState } from "../types";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
  },
});

// تایپ‌های Redux برای useSelector و useDispatch
export type AppDispatch = typeof store.dispatch;
export type { RootState };