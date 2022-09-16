import React, { FC, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import * as SplashScreen from "expo-splash-screen";

import { useCustomFonts } from "~core";
import AccountModule from "~modules/account";
import {
  Greeting,
  InputImageAndBirthday,
  InputNickname,
  InputNumberPhone,
  InputSMSCode,
  Intro,
  SelectMethodAuthentication,
  Main,
  Profile,
  EditMainUserData,
  EditDateUserBirthday,
  PracticesList,
  SelectSubscribe,
  ResultSubscribe,
  MeditationPracticeList,
  PlayerMeditationPractices,
  BackgroundSound,
  TimerPractices,
} from "~components/screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MeditationPracticesRoutes } from "./routes";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AppCore: FC<Props> = (props) => {
  // Загрузка кастомных шрифтов
  const [loaded, error] = useCustomFonts();
  useEffect(() => {
    if (loaded) {
      console.log(`Hermes ${!!global.HermesInternal ? "" : "не "}используется`);
      SplashScreen.hideAsync().catch(console.error);
    } else {
      SplashScreen.preventAutoHideAsync().catch(console.error);
    }
  }, [loaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        {/*<NavigationContainer>*/}
        <AccountModule dev_screen={AppPlayer} />
        {/*</NavigationContainer>*/}
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

const AppPlayer = () => {
  return (
    <NavigationContainer>
      <MeditationPracticesRoutes />
    </NavigationContainer>
  );
};

interface Props {}

export default AppCore;
