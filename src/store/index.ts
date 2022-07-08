import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import account from "./account";
import meditation from "./meditation";

const createDebugger = require("redux-flipper").default;

const store = configureStore({
  reducer: {
    account,
    meditation,
  },
  middleware: (getDefaultMiddleware) =>
    __DEV__
      ? getDefaultMiddleware().concat(createDebugger())
      : getDefaultMiddleware(),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
