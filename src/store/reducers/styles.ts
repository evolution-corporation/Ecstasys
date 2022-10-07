import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";

export interface StyleState {
  loaded: boolean;
}

export default createReducer<StyleState>(
  {
    loaded: false,
  },
  (builder) => {
    builder.addCase(actions.initializationStyle.fulfilled, (state) => {
      state.loaded = true;
    });
  }
);
