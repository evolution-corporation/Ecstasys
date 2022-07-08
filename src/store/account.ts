import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeUserData } from "~api/config";
import {
  authentication as authenticationAccount,
  registration as registrationAccount,
  setMood,
} from "~api/user";

const initialState: AccountState = {};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    editMood: (
      state: AccountState,
      { payload }: PayloadAction<UserMood | undefined>
    ) => {
      state.mood = payload;
      if (!!payload) {
        setMood(payload);
      }
    },
    signOut: (state: AccountState) => {
      state.user = undefined;
      state.mood = undefined;
      removeUserData();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      authentication.fulfilled,
      (state: AccountState, { payload }) => {
        if (!!payload) {
          state.user = payload;
        }
      }
    );
    builder.addCase(
      registration.fulfilled,
      (state: AccountState, { payload }) => {
        state.user = payload;
      }
    );
  },
});

export const registration = createAsyncThunk(
  "account/registration",
  async (userData: UserMinimalData, {}) => registrationAccount(userData)
);

export const authentication = createAsyncThunk(
  "account/authentication",
  async (_, {}) => authenticationAccount()
);

export const { editMood, signOut } = accountSlice.actions;

export default accountSlice.reducer;
