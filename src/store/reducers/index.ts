import { combineReducers } from "@reduxjs/toolkit";
import { default as AccountReducer } from "./account";
import { default as MeditationReducer } from "./meditation";
import { default as StyleReducer } from "./styles";

export default combineReducers({
  account: AccountReducer,
  meditation: MeditationReducer,
  style: StyleReducer,
});
