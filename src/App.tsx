import React, { FC, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { useCustomFonts } from "~core";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import auth from "@react-native-firebase/auth";

import RootRoutes from "./routes";
import Store, { actions } from "./store";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AppCore: FC<Props> = (props) => {
  // Загрузка кастомных шрифтов
  const subscribeReduxState = useRef<null | { (): void }>(null);
  // Авторизация через Firebase
  // TODO Разработать свою систему авторизации

  useEffect(() => {
    const initializationApplication = async () => {
      subscribeReduxState.current = Store.subscribe(() => {
        const { account, style } = Store.getState();
        if (account.isLoaded && style.loaded) {
          if (subscribeReduxState.current) subscribeReduxState.current();
          SplashScreen.hideAsync();
        }
      });
      Store.dispatch(actions.initializationAccount()).unwrap();
      Store.dispatch(actions.initializationStyle()).unwrap();
    };
    initializationApplication();
    return () => {
      if (subscribeReduxState.current) subscribeReduxState.current();
    };
  }, []);

  return (
    <Provider store={Store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RootRoutes />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

interface Props {}

export default AppCore;
