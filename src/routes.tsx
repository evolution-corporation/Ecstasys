import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { StackScreenProps } from "@react-navigation/stack";

import {
  createBottomTabNavigator,
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import Core from "~core";
import Meditation, { DescriptionMeditationCategory } from "~modules/meditation";
import MeditationModels, { Relax } from "~modules/meditation/models"; //! debug
import * as Screens from "~components/screens";

import { Audio } from "expo-av"; //! debug
import { ColorButton, UserButton } from "~components/dump";

import TreeLine from "~assets/ThreeLine.svg";
import { TypeMeditation } from "~modules/meditation/types";

// * Авторизированные и зарегестрированые пользователи
const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => (
  <TabNavigator.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#9765A8",
      },
      headerTintColor: "#FFFFFF",
      headerShadowVisible: false,
    }}
  >
    <TabNavigator.Screen
      name={"Main"}
      component={Screens.Main}
      options={{
        headerTransparent: true,
        headerTitle: () => null,
        headerLeft: () => <UserButton style={{ marginLeft: 20 }} />,
      }}
    />
    <TabNavigator.Screen
      name={"PracticesList"}
      component={Screens.PracticesList}
      options={{
        title: Core.i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05"),
        headerRight: () => <UserButton style={{ marginRight: 20 }} />,
      }}
    />
    <TabNavigator.Screen
      name={"Profile"}
      component={Screens.Profile}
      options={{
        headerRight: () => (
          <ColorButton
            secondItem={<TreeLine />}
            styleButton={{ backgroundColor: "transparent", marginRight: 17 }}
            onPress={() => {
              navigation.navigate("EditUserData");
            }}
          />
        ),
      }}
    />
  </TabNavigator.Navigator>
);

export type TabNavigatorList = {
  Profile: undefined;
  Main: undefined;
  PracticesList: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorList> = FC<
  BottomTabScreenProps<TabNavigatorList, T>
>;

// * meditation
const MeditationPractices =
  createNativeStackNavigator<MeditationPracticesList>();

export const MeditationPracticesRoutes: RootScreenProps<"ListenMeditation"> = ({
  route,
}) => {
  const { meditationId, typeMeditation } = route.params;
  const [meditation, setMeditation] = useState<MeditationModels | null>(null);
  useEffect(() => {
    const init = async () => {
      const { sound } = await Audio.Sound.createAsync(require("../test.mp3"));
      let lengthAudio = 60000;
      const audioStatus = await sound.getStatusAsync();
      if (audioStatus.isLoaded) {
        lengthAudio = audioStatus.durationMillis ?? 6000;
      }
      if (typeMeditation === "relaxation") {
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
      }
    };
    init();
    return () => {};
  }, [setMeditation]);
  if (meditation == null) return null;
  return (
    <Meditation meditation={meditation}>
      <MeditationPractices.Navigator
        screenOptions={() => ({
          headerTitle: () => (
            <View>
              <Text style={styles.meditationName}>{meditation.name}</Text>
              <Text style={styles.meditationType}>
                {Core.i18n.t(meditation.typeMeditation)}
              </Text>
            </View>
          ),
          headerTransparent: true,
          headerTintColor: "#FFFFFF",
          headerTitleAlign: "center",
        })}
      >
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
          options={{
            headerTitle: undefined,
            title: Core.i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90"),
          }}
        />
      </MeditationPractices.Navigator>
    </Meditation>
  );
};

export type MeditationPracticesList = {
  TimerPractices: undefined;
  PlayerScreen: undefined;
  BackgroundSound: undefined;
};

export type MeditationPracticesScreenProps<
  T extends keyof MeditationPracticesList
> = FC<NativeStackScreenProps<MeditationPracticesList, T>>;

// * root
const RootNavigation = createNativeStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
  return (
    <RootNavigation.Navigator
      initialRouteName="IntroPractices"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
      }}
    >
      <RootNavigation.Screen
        name={"TabNavigator"}
        component={TabRoutes}
        options={{ headerShown: false }}
      />
      <RootNavigation.Screen
        name={"EditUserData"}
        component={Screens.EditMainUserData}
        options={{
          title: Core.i18n.t("Profile"),
        }}
      />
      <RootNavigation.Screen
        name={"EditUserBirthday"}
        component={Screens.EditDateUserBirthday}
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <RootNavigation.Screen
        name={"SelectSubscribe"}
        component={Screens.SelectSubscribe}
        options={{
          title: Core.i18n.t("subscribe"),
        }}
      />
      <RootNavigation.Screen
        name={"SelectPractices"}
        component={Screens.MeditationPracticeList}
        options={({ route }) => ({
          title: Core.i18n.t(
            DescriptionMeditationCategory[route.params.typeMeditation].title
          ),
          headerTitleAlign: "center",
        })}
      />
      <RootNavigation.Screen
        name={"ListenMeditation"}
        component={MeditationPracticesRoutes}
        options={{
          headerShown: false,
        }}
      />
      <RootNavigation.Screen
        name={"IntroPractices"}
        component={Screens.IntroPracticesScreen}
        options={{
          headerShown: false,
        }}
      />
    </RootNavigation.Navigator>
  );
};

export type RootStackList = {
  TabNavigator: NavigatorScreenParams<TabNavigatorList>;
  EditUserData: undefined;
  EditUserBirthday: undefined;
  SelectSubscribe: undefined;
  SelectPractices: {
    typeMeditation: TypeMeditation;
  };
  ListenMeditation: {
    meditationId: string;
    typeMeditation: TypeMeditation;
  };
  IntroPractices: undefined;
};
export type RootScreenProps<T extends keyof RootStackList> = FC<
  NativeStackScreenProps<RootStackList, T>
>;

export default RootRoutes;

export type ProfileCompositeStackNaviatorProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorList, "Profile">,
  NativeStackNavigationProp<RootStackList, "SelectSubscribe">
>;

export type PracticesCompositeListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabNavigatorList, "PracticesList">,
  StackScreenProps<RootStackList, "SelectPractices">
>;

export type PracticesCompositeScreenProps =
  FC<PracticesCompositeListScreenProps>;

// * неавторизированные пользователи

const AuthenticationNavigation =
  createNativeStackNavigator<AuthenticationStackList>();

export const AuthenticationRoutes: FC = () => {
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

const styles = StyleSheet.create({
  meditationName: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Core.gStyle.font("700"),
    textAlign: "center",
  },
  meditationType: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Core.gStyle.font("400"),
    textAlign: "center",
  },
});
