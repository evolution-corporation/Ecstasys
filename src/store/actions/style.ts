import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "~store";
import { loadAsync } from "expo-font";

import {
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

enum StyletAction {
  initialization = "style/Initialization",
}

export const initializationStyle = createAsyncThunk<
  void,
  undefined,
  AsyncThunkConfig
>(StyletAction.initialization, async () => {
  await loadAsync({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
    Inter_700Bold,
  });
});
