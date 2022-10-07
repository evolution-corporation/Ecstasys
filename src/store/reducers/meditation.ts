import { createReducer } from "@reduxjs/toolkit";
import { Meditation } from "~types";

export interface MeditationState {
  favoriteMeditation: Meditation[];
  statisticsListen: {
    [key in "week" | "month" | "all"]: {
      dateTimeListing: string;
      listenedMilliseconds: number;
    }[];
  };
}

export default createReducer<MeditationState>(
  {
    favoriteMeditation: [],
    statisticsListen: {
      all: [],
      month: [],
      week: [],
    },
  },
  (builder) => {}
);
