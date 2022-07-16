import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setParametersMeditation,
  removeParametersMeditation as removeParametersMeditationMemory,
  getMeditationToDay as getMeditationToDayServer,
  removeFavoriteMeditation as removeFavoriteMeditationMemory,
  addFavoriteMeditation as addFavoriteMeditationMemory,
  setWeekStatistic,
} from "~api/meditation";
import type { RootState } from ".";

const initialState: MeditationState = {
  weekStatistic: {
    count: 0,
    time: 0,
  },
  favoriteMeditationId: [],
};

const meditationSlice = createSlice({
  name: "meditation",
  initialState,
  reducers: {
    editParametersMeditation: (
      state: MeditationState,
      { payload }: PayloadAction<ParametersMeditation | undefined>
    ) => {
      if (!!payload) setParametersMeditation(payload);
      state.parametersMeditation = payload;
      state.parametersMeditationStatus = "exist";
    },
    removeParametersMeditation: (state: MeditationState) => {
      removeParametersMeditationMemory();
      state.parametersMeditation = undefined;
      state.parametersMeditationStatus = "not exist";
    },
    addWeekStaticOneSeance: (
      state: MeditationState,
      { payload }: PayloadAction<number>
    ) => {
      state.weekStatistic.count += 1;
      state.weekStatistic.time += payload;
      setWeekStatistic(state.weekStatistic);
    },
    addWeekStatic: (
      state: MeditationState,
      { payload }: PayloadAction<WeekStatistic>
    ) => {
      state.weekStatistic.count += payload.count;
      state.weekStatistic.time += payload.time;
      setWeekStatistic(state.weekStatistic);
    },
    addFavoriteMeditation: (
      state: MeditationState,
      { payload }: PayloadAction<string | string[]>
    ) => {
      if (Array.isArray(payload)) {
        state.favoriteMeditationId = [
          ...state.favoriteMeditationId,
          ...payload,
        ];
      } else {
        if (!state.favoriteMeditationId.includes(payload))
          state.favoriteMeditationId.push(payload);
        addFavoriteMeditationMemory(payload);
      }
    },
    removeFavoriteMeditation: (
      state: MeditationState,
      { payload }: PayloadAction<string>
    ) => {
      if (state.favoriteMeditationId.includes(payload))
        state.favoriteMeditationId = [
          ...state.favoriteMeditationId.filter((item) => item != payload),
        ];
      removeFavoriteMeditationMemory(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMeditationToDay.fulfilled, (state, { payload }) => {
      state.meditationPopularToDay = payload.popularToDay;
      state.meditationRecommendToDay = payload.meditationRecommend;
    });
  },
});

export const getMeditationToDay = createAsyncThunk(
  "meditation/getPopularToDayMeditation",
  (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.meditation.meditationPopularToDay)
      return getMeditationToDayServer(state.meditation.parametersMeditation);
    else {
      return {
        popularToDay: state.meditation.meditationPopularToDay,
        meditationRecommend: state.meditation.meditationRecommendToDay,
      };
    }
  }
);

export default meditationSlice.reducer;

export const {
  editParametersMeditation,
  removeParametersMeditation,
  addWeekStaticOneSeance,
  addWeekStatic,
  addFavoriteMeditation,
  removeFavoriteMeditation,
} = meditationSlice.actions;
