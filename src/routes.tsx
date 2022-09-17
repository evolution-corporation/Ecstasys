import React, { FC, useEffect, useState } from "react";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Core from "~core";
import Meditation from "~modules/meditation";
import MeditationModels, { Relax } from "~modules/meditation/models"; //! debug
import * as Screens from "~components/screens";

import { Audio } from "expo-av"; //! debug

// * Авторизированные и зарегестрированые пользователи
const TabNavigator = createBottomTabNavigator();

const TabRoutes = () => (
  //@ts-ignore
  <TabNavigator.Navigator>
    <TabNavigator.Screen name={"Profile"} component={Screens.Profile} />
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
        <MeditationPractices.Screen
          name={"TimerPractices"}
          component={Screens.TimerPractices}
        />
        <MeditationPractices.Screen
          name={"PlayerScreen"}
          component={Screens.PlayerMeditationPractices}
        />
        <MeditationPractices.Screen
          name={"BackgroundSound"}
          component={Screens.BackgroundSound}
        />
      </MeditationPractices.Navigator>
    </Meditation>
  );
};

const RootNavigation = createNativeStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
  console.log("root");
  return (
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

// * неавторизированные пользователи

const AuthenticationNavigation =
  createNativeStackNavigator<AuthenticationStackList>();

export const AuthenticationRoutes: FC = () => {
  console.log("Authentication");
  return (
    <AuthenticationNavigation.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
      }}
    >
      <AuthenticationNavigation.Screen
        name={"Intro"}
        component={Screens.Intro}
        options={{
          headerShown: false,
        }}
      />
      <AuthenticationNavigation.Screen
        name={"SelectMethodAuthentication"}
        component={Screens.SelectMethodAuthentication}
        options={{
          headerShown: false,
        }}
      />
      <AuthenticationNavigation.Screen
        name={"InputNumberPhone"}
        component={Screens.InputNumberPhone}
        options={{
          title: Core.i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae"),
        }}
      />
      <AuthenticationNavigation.Screen
        name={"InputSMSCode"}
        component={Screens.InputSMSCode}
        options={{
          title: "",
        }}
      />
    </AuthenticationNavigation.Navigator>
  );
};

export type AuthenticationStackList = {
  Intro: undefined;
  SelectMethodAuthentication: undefined;
  InputNumberPhone: undefined;
  InputSMSCode: undefined;
};
export type AuthenticationScreenProps<T extends keyof AuthenticationStackList> =
  FC<NativeStackScreenProps<AuthenticationStackList, T>>;

// * Не зарегестированные пользователи
const RegistrationNavigation =
  createNativeStackNavigator<RegistrationStackList>();

export const RegistrationRoutes: FC = () => {
  console.log("Registration");
  return (
    <RegistrationNavigation.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
      }}
    ></RegistrationNavigation.Navigator>
  );
};

export type RegistrationStackList = {};
export type RegistrationScreenProps<T extends keyof RegistrationStackList> = FC<
  NativeStackScreenProps<RegistrationStackList, T>
>;
