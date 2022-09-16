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

import Meditation from "~modules/meditation";
import MeditationModels, { Relax } from "~modules/meditation/models"; //! debug
import { Audio } from "expo-av"; //! debug

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
  const [meditation, setMeditation] = useState<MeditationModels | null>(null);
  useEffect(() => {
    const init = async () => {
      const { sound } = await Audio.Sound.createAsync(require("../test.mp3"));
      let lengthAudio = 60000;
      const audioStatus = await sound.getStatusAsync();
      if (audioStatus.isLoaded) {
        lengthAudio = audioStatus.durationMillis ?? 6000;
      }
      setMeditation(
        new Relax(
          "1",
          "Test Name",
          "testDiscription",
          "https://oir.mobi/uploads/posts/2021-06/1623116905_30-oir_mobi-p-nochnaya-doroga-v-lesu-priroda-krasivo-fot-35.jpg",
          {
            length: lengthAudio,
            sound: sound,
          }
        )
      );
    };
    init();
    return () => {};
  }, [setMeditation]);
  if (meditation == null) return null;
  return (
    <Meditation meditation={meditation}>
      <TimerPractices />
    </Meditation>
  );
};

interface Props {}

export default AppCore;
