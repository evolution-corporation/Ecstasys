import React, { FC, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager, View, Text } from "react-native";
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
  SelectSubscribeScreen,
} from "~components/screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
        <AccountModule dev_screen={SelectSubscribeScreen} />
        {/*</NavigationContainer>*/}
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

interface Props {}

export default AppCore;
