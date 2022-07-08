import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setParametersMeditation,
  removeParametersMeditation as removeParametersMeditationMemory,
  getMeditationToDay as getMeditationToDayServer,
} from "~api/meditation";
import type { AppDispatch, RootState } from ".";

const initialState: MeditationState = {
  weekStatistic: {
    count: 0,
    time: 0,
  },
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
    },
    addWeekStatic: (
      state: MeditationState,
      { payload }: PayloadAction<WeekStatistic>
    ) => {
      state.weekStatistic.count += payload.count;
      state.weekStatistic.time += payload.time;
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

export const { editParametersMeditation, removeParametersMeditation } =
  meditationSlice.actions;
