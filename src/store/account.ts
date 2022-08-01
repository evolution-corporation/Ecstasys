import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeUserData } from "~api/config";
import {
  authentication as authenticationAccount,
  registration as registrationAccount,
  setMood as setMoodMemory,
  getMood as getMoodMemory,
  lazyUpdateUserData,
  DateUserUpdate,
} from "~api/user";
import { initStatisticMeditation } from "./meditation";

const initialState: AccountState = {
  moodScore: [],
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setMood: (
      state: AccountState,
      {
        payload,
      }: PayloadAction<{ mood: UserMood | undefined; score: number[] }>
    ) => {
      state.mood = payload.mood;
      state.moodScore = payload.score;
    },
    editMood: (
      state: AccountState,
      { payload }: PayloadAction<UserMood | undefined>
    ) => {
      state.mood = payload;
      switch (payload) {
        case "ANXIETY":
        case "FATIGUE":
        case "ABSENTMINDEDNESS":
          state.moodScore = [...state.moodScore, 50];
          break;
        case "PACIFICATION":
        case "CONCENTRATION":
        case "HAPPINESS":
          state.moodScore = [...state.moodScore, 100];
          break;
        case "SADNESS":
        case "IRRITATION":
          state.moodScore = [...state.moodScore, 40];
          break;
      }
      if (!!payload) {
        setMoodMemory(payload, state.moodScore);
      }
    },
    signOut: (state: AccountState) => {
      state.user = undefined;
      state.mood = undefined;
      state.moodScore = [];
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
    builder.addCase(
      updateData.fulfilled,
      (state: AccountState, { payload }) => {
        state.user = payload;
      }
    );
    builder.addCase(initMood.fulfilled, (state: AccountState, { payload }) => {
      state.mood = payload.mood;
      state.moodScore = payload.score;
    });
  },
});

export const registration = createAsyncThunk(
  "account/registration",
  async (userData: UserMinimalData, {}) => registrationAccount(userData)
);

export const authentication = createAsyncThunk(
  "account/authentication",
  async (_, {}) => await authenticationAccount()
);

export const updateData = createAsyncThunk(
  "account/update",
  async (data: DateUserUpdate, { getState }) => {
    const state = getState();
    for (let key of Object.keys(data)) {
      if (data[key] == undefined || state.account?.user[key] == data[key]) {
        delete data[key];
      }
    }
    return await lazyUpdateUserData(data, state.account?.user);
  }
);

export const initMood = createAsyncThunk("account/initMood", async (_, {}) => {
  const mood = await getMoodMemory();
  return { score: mood.score, mood: mood.mood };
});

export const loadingAccountData = createAsyncThunk(
  "account/loadingAccountData",
  async (_, { getState, dispatch }) => {
    const store: AccountState = getState().account;
    if (!!store.user) {
      dispatch(initMood());
    }
  }
);

export const { editMood, signOut, setMood } = accountSlice.actions;

export default accountSlice.reducer;
