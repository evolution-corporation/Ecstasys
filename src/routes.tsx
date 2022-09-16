import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Meditation from "~modules/meditation";

import {
  PlayerMeditationPractices,
  BackgroundSound,
  TimerPractices,
} from "~components/screens";
import MeditationModels, { Relax } from "~modules/meditation/models"; //! debug
import { Audio } from "expo-av"; //! debug

const TabNavigator = createBottomTabNavigator();

const TabRoutes = () => (
  //@ts-ignore
  <TabNavigator.Navigator>
    <TabNavigator.Screen
      name={"Profile"}
      component={() => <View>{null}</View>}
    />
  </TabNavigator.Navigator>
);

const MeditationPractices =
  createNativeStackNavigator<MeditationPracticesList>();

export const MeditationPracticesRoutes: FC = () => {
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
      <MeditationPractices.Navigator>
        {/* <MeditationPractices.Screen
          name={"TimerPractices"}
          component={TimerPractices}
        /> */}
        <MeditationPractices.Screen
          name={"PlayerScreen"}
          component={PlayerMeditationPractices}
        />
        <MeditationPractices.Screen
          name={"BackgroundSound"}
          component={BackgroundSound}
        />
      </MeditationPractices.Navigator>
    </Meditation>
  );
};

const RootNavigation = createNativeStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
  console.log("root");
  return (
    //@ts-ignore
    <RootNavigation.Navigator>
      <RootNavigation.Screen name={"TabNavigator"} component={TabRoutes} />
    </RootNavigation.Navigator>
  );
};

export default RootRoutes;

export type MeditationPracticesList = {
  TimerPractices: undefined;
  PlayerScreen: undefined;
  BackgroundSound: undefined;
};

export type MeditationPracticesScreenProps<
  T extends keyof MeditationPracticesList
> = FC<NativeStackScreenProps<MeditationPracticesList, T>>;

export type RootStackList = {
  TabNavigator: undefined;
};
export type RootScreenProps<T extends keyof RootStackList> = FC<
  NativeStackScreenProps<RootStackList, T>
>;
