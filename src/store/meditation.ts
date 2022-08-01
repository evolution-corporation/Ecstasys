import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setParametersMeditation,
  removeParametersMeditation as removeParametersMeditationMemory,
  getMeditationToDay as getMeditationToDayServer,
  removeFavoriteMeditation as removeFavoriteMeditationMemory,
  addFavoriteMeditation as addFavoriteMeditationMemory,
  setWeekStatistic,
  setAllTimeStatistic,
  setMonthStatistic,
  getStatistic,
  getFavoriteMeditation,
  getParametersMeditation,
} from "~api/meditation";
import type { RootState } from ".";

const initialState: MeditationState = {
  statisticMeditation: {
    all: { count: 0, time: 0 },
    week: { count: 0, time: 0 },
    month: { count: 0, time: 0 },
  },
  favoriteMeditation: [],
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
    addStaticOneSeance: (
      state: MeditationState,
      { payload }: PayloadAction<number>
    ) => {
      for (let timeName of Object.keys(state.statisticMeditation)) {
        state.statisticMeditation[timeName].count += 1;
        state.statisticMeditation[timeName].time += payload;
      }
      setWeekStatistic(state.statisticMeditation.week);
      setAllTimeStatistic(state.statisticMeditation.all);
      setMonthStatistic(state.statisticMeditation.month);
    },
    addFavoriteMeditation: (
      state: MeditationState,
      {
        payload,
      }: PayloadAction<{ id: string; name: string; type: MediaDecodingType }>
    ) => {
      if (!state.favoriteMeditation.includes(payload))
        state.favoriteMeditation.push(payload);
      addFavoriteMeditationMemory(payload);
    },
    removeFavoriteMeditation: (
      state: MeditationState,
      { payload }: PayloadAction<string>
    ) => {
      if (!!state.favoriteMeditation.find((item) => item.id == payload))
        state.favoriteMeditation = [
          ...state.favoriteMeditation.filter((item) => item.id != payload),
        ];
      removeFavoriteMeditationMemory(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMeditationToDay.fulfilled, (state, { payload }) => {
      state.meditationPopularToDay = payload.popularToDay;
      state.meditationRecommendToDay = payload.meditationRecommend;
    });
    builder.addCase(initStatisticMeditation.fulfilled, (state, { payload }) => {
      for (let timeName of Object.keys(state.statisticMeditation)) {
        state.statisticMeditation[timeName].count += payload[timeName].count;
        state.statisticMeditation[timeName].time += payload[timeName].time;
      }
    });
    builder.addCase(initFavoriteMeditation.fulfilled, (state, { payload }) => {
      state.favoriteMeditation = [
        ...new Set([...state.favoriteMeditation, ...payload]),
      ];
    });
    builder.addCase(
      initParametersMeditation.fulfilled,
      (state, { payload }) => {
        state.parametersMeditationStatus = payload[0];
        state.parametersMeditation = payload[1];
        if (parameters[0] == "not exist") {
          removeParametersMeditationMemory();
        }
      }
    );
  },
});

export const getMeditationToDay = createAsyncThunk(
  "meditation/getPopularToDayMeditation",
  async (data, { getState }) => {
    if (data == undefined) {
      data = getState().meditation.parametersMeditation;
    }
    if (!getState().meditation.meditationPopularToDay)
      return getMeditationToDayServer(data);
    else {
      return {
        popularToDay: state.meditation.meditationPopularToDay,
        meditationRecommend: state.meditation.meditationRecommendToDay,
      };
    }
  }
);

export const initStatisticMeditation = createAsyncThunk(
  "meditation/initStatistic",
  async () => await getStatistic()
);

export const initFavoriteMeditation = createAsyncThunk(
  "meditation/initFavorite",
  async () => await getFavoriteMeditation()
);

export const initParametersMeditation = createAsyncThunk(
  "meditation/initParameters",
  async (_, { dispatch }) => {
    const parameters = await getParametersMeditation();
    if (parameters[0] == "exist") {
      dispatch(editParametersMeditation(parameters[1]));
      dispatch(getMeditationToDay(parameters[1]));
    } else {
      dispatch(removeParametersMeditation());
    }
  }
);

export const loadingMeditationData = createAsyncThunk(
  "meditation/loadingData",
  async (_, { dispatch }) => {
    dispatch(initStatisticMeditation());
    dispatch(initFavoriteMeditation());
    dispatch(initParametersMeditation());
  }
);

export default meditationSlice.reducer;

export const {
  editParametersMeditation,
  removeParametersMeditation,
  addStaticOneSeance,
  addFavoriteMeditation,
  removeFavoriteMeditation,
} = meditationSlice.actions;
