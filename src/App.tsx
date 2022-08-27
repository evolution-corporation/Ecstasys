import React, { FC, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager, View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useCustomFonts } from "~core";
import AccountModule from "~modules/account";
import { RootSiblingParent } from "react-native-root-siblings";
import {
  Greeting,
  InputImageAndBirthday,
  InputNickname,
  InputNumberPhone,
  InputSMSCode,
  Intro,
  SelectMethodAuthentication,
} from "~components/screens";

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
    <RootSiblingParent>
      {/*<FlipperAsyncStorage />*/}
      {/*<NavigationContainer>*/}
      <AccountModule dev_screen={Greeting} />
      {/*</NavigationContainer>*/}
    </RootSiblingParent>
  );
};

interface Props {}

export default AppCore;
