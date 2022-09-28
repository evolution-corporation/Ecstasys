import React, { FC, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
  useFocusEffect,
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
import { useHeaderHeight } from "@react-navigation/elements";
import { Audio } from "expo-av";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import Core from "~core";
import Meditation, {
  API,
  DescriptionMeditationCategory,
} from "~modules/meditation";
import MeditationModels, { Relax, Vision } from "~modules/meditation/models"; //! debug
import * as Screens from "~components/screens";

import { ColorButton, FavoriteMeditation, UserButton } from "~components/dump";

import TreeLine from "~assets/ThreeLine.svg";
import type { Instruction, TypeMeditation } from "~modules/meditation/types";

import MainIcon from "./assets/HomeIcon";
import PracticesIcon from "./assets/PracticesIcon";
import DMDIcon from "./assets/DMDIcon";
import ProfileIcon from "./assets/ProfileIcon";
import SubscribeProvider from "~modules/subscribe";

// * Авторизированные и зарегестрированые пользователи
const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => {
  const translateYTabNavigator = useSharedValue(0);
  const animationStyleTabNavigator = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYTabNavigator.value }],
  }));
  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        tabBarShowLabel: false,
        headerTitleStyle: {
          ...Core.gStyle.font("700"),
          fontSize: 24,
        },
        tabBarStyle: {
          height: 75,
        },
      }}
    >
      <TabNavigator.Screen
        name={"Main"}
        component={Screens.Main}
        options={{
          headerTransparent: true,
          headerShown: false,
          tabBarIcon: ({ focused, color }) => <MainIcon colorIcon={focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"} />,
        }}
      />
      <TabNavigator.Screen
        name={"PracticesList"}
        component={Screens.PracticesList}
        options={{
          title: Core.i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05"),
          headerRight: () => <UserButton style={{ marginRight: 20 }} />,
          tabBarIcon: ({ focused }) => (
            <PracticesIcon
              colorIcon={
                focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"
              }
            />
          ),
        }}
      />
      <TabNavigator.Screen
        name={"Profile"}
        component={Screens.Profile}
        options={{
          headerRight: () => (
            <ColorButton
              secondItem={<TreeLine />}
              styleButton={{
                backgroundColor: "transparent",
                marginRight: 17,
              }}
              onPress={() => {
                navigation.navigate("OptionsProfile");
              }}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              colorIcon={
                focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"
              }
            />
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
};

export type TabNavigatorList = {
  Profile: undefined;
  Main: undefined;
  PracticesList: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorList> = FC<
  BottomTabScreenProps<TabNavigatorList, T>
>;

export type TabCompositeStackNavigatorProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorList, "Main">,
  BottomTabNavigationProp<TabNavigatorList, "PracticesList">
>;

// * meditation
const MeditationPractices =
  createNativeStackNavigator<MeditationPracticesList>();

export const MeditationPracticesRoutes: RootScreenProps<"ListenMeditation"> = ({
  route,
}) => {
  const { meditationId } = route.params;
  const [meditation, setMeditation] = useState<MeditationModels | null>(null);

  useEffect(() => {
    const init = async () => {
      const meditation = await API.getMeditationById(meditationId);
      let _meditation: MeditationModels | undefined;
      switch (meditation.type) {
        case "relaxation":
          if (meditation.audio !== undefined) {
            _meditation = new Relax(
              meditation.id,
              meditation.name,
              meditation.description,
              meditation.image,
              {
                length: meditation.lengthAudio,
                sound: (
                  await Audio.Sound.createAsync(
                    { uri: meditation.audio },
                    { isLooping: true }
                  )
                ).sound,
              }
            );
          }
          break;
        case "directionalVisualizations":
          if (meditation.audio !== undefined) {
            _meditation = new Vision(
              meditation.id,
              meditation.name,
              meditation.description,
              meditation.image,
              {
                length: meditation.lengthAudio,
                sound: (
                  await Audio.Sound.createAsync(
                    { uri: meditation.audio },
                    { isLooping: true }
                  )
                ).sound,
              }
            );
          }

          break;
        default:
          break;
      }
      if (_meditation) setMeditation(_meditation);
    };
    init();
  }, [meditationId]);

  const { getItem, setItem } = useAsyncStorage("@StatisticsMeditation");

  useFocusEffect(
    useCallback(() => {
      const close = async (_meditation: MeditationModels) => {
        const statisticsAS = await getItem();
        const statistics: { timeLength: number; time: Date }[] = [];
        if (_meditation) {
          if (statisticsAS !== null) {
            const jsnoParse: { timeLength: number; time: Date }[] = JSON.parse(
              statisticsAS
            ).map((item: { timeLength: number; time: string }) => ({
              ...item,
              time: new Date(item.time),
            }));
            statistics.splice(0, 0, ...jsnoParse, {
              timeLength: _meditation.getPosition(),
              time: new Date(),
            });
          } else {
            statistics.push({
              timeLength: _meditation.getPosition(),
              time: new Date(),
            });
          }
          setItem(JSON.stringify(statistics));
          await _meditation.stop();
        }
      };
      return () => {
        if (meditation !== null) {
          close(meditation).catch(console.error);
        }
      };
    }, [meditation])
  );

  if (meditation == null)
    return (
      <View style={styles.screenLoading}>
        <ActivityIndicator color={"#FFFFFF"} />
      </View>
    );
  return (
    <Meditation meditation={meditation}>
      <MeditationPractices.Navigator
        screenOptions={{
          headerTitle: () => (
            <View>
              <Text style={styles.meditationName} adjustsFontSizeToFit>
                {meditation.name}
              </Text>
              <Text style={styles.meditationType}>
                {Core.i18n.t(meditation.typeMeditation)}
              </Text>
            </View>
          ),
          headerRight: () => null,
          headerTransparent: true,
          headerTintColor: "#FFFFFF",
          headerTitleAlign: "center",
          headerTitleStyle: {
            ...Core.gStyle.font("700"),
            fontSize: 24,
          },
        }}
        initialRouteName={
          meditation.typeMeditation === "directionalVisualizations"
            ? "PlayerScreen"
            : "TimerPractices"
        }
      >
        <MeditationPractices.Screen
          name={"TimerPractices"}
          component={Screens.TimerPractices}
        />
        <MeditationPractices.Screen
          name={"PlayerScreen"}
          component={Screens.PlayerMeditationPractices}
          options={{
            headerRight: () => (
              <FavoriteMeditation
                idMeditation={meditationId}
                displayWhenNotFavorite
              />
            ),
          }}
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

const RootRoutes: FC = () => (
  <SubscribeProvider>
    <RootNavigation.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        headerTitleStyle: {
          ...Core.gStyle.font("700"),
          fontSize: 24,
        },
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
      <RootNavigation.Screen
        name={"IntroMainScreen"}
        component={Screens.Greeting}
        options={{
          headerShown: false,
        }}
      />
      <RootNavigation.Screen
        name={"Instruction"}
        component={Screens.Instruction}
        options={({ route }) => ({
          headerTitle: () => (
            <View>
              <Text style={styles.meditationName} adjustsFontSizeToFit>
                {Core.i18n.t("2ca96716-54d7-4cfa-a6fe-d68c8abd4666")}
              </Text>
              <Text style={styles.meditationType}>
                {Core.i18n.t(
                  DescriptionMeditationCategory[route.params.typeMeditationName]
                    .title
                )}
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
        })}
      />
      <RootNavigation.Screen
        name={"FavoriteMeditation"}
        component={Screens.FavoriteMeditation}
        options={{
          title: Core.i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1"),
          headerTitleAlign: "center",
        }}
      />
      <RootNavigation.Screen
        name={"OptionsProfile"}
        component={Screens.OptionsProfile}
        options={{
          title: Core.i18n.t("options"),
          headerTitleAlign: "center",
        }}
      />
      <RootNavigation.Screen
        name="devSetting"
        component={Screens.DevSettings}
        options={{
          title: Core.i18n.t("f56183f9-c95c-4e3c-965d-2eee5791d1d6"),
        }}
      />
      <RootNavigation.Screen name={"Payment"} component={Screens.PaymentWeb} />
    </RootNavigation.Navigator>
  </SubscribeProvider>
);

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
  };
  IntroPractices: undefined;
  IntroMainScreen: undefined;
  Instruction: {
    instruction: Instruction;
    typeMeditationName: string;
  };
  FavoriteMeditation: undefined;
  OptionsProfile: undefined;
  devSetting: undefined;
  Payment: undefined;
};
export type RootScreenProps<T extends keyof RootStackList> = FC<
  NativeStackScreenProps<RootStackList, T>
>;

export default RootRoutes;

type RootCompositeStackNavigatorProps = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackList, "IntroPractices">,
  NativeStackNavigationProp<RootStackList, "SelectPractices">
>;

export type ProfileCompositeStackNaviatorProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorList, "Profile">,
  NativeStackNavigationProp<RootStackList, "SelectSubscribe">
>;

export type MainCompositeStackNaviatorProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorList, "Main">,
  NativeStackNavigationProp<RootStackList, "ListenMeditation">
>;

export type ProfileCompositeScreenProps = FC<
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorList, "Profile">,
    StackScreenProps<RootStackList, "FavoriteMeditation">
  >
>;

export type PracticesCompositeListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabNavigatorList, "PracticesList">,
  StackScreenProps<RootStackList, "SelectPractices">
>;

export type PracticesCompositeScreenProps =
  FC<PracticesCompositeListScreenProps>;

export type MainScreenCompositeScreenProps = FC<
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorList, "Main">,
    StackScreenProps<RootStackList, "IntroMainScreen">
  >
>;

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
      <AuthenticationNavigation.Screen
        name="devSetting"
        component={Screens.DevSettings}
        options={{
          title: Core.i18n.t("f56183f9-c95c-4e3c-965d-2eee5791d1d6"),
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
  devSetting: undefined;
};
export type AuthenticationScreenProps<T extends keyof AuthenticationStackList> =
  FC<NativeStackScreenProps<AuthenticationStackList, T>>;

// * Не зарегестированные пользователи
const RegistrationNavigation =
  createNativeStackNavigator<RegistrationStackList>();

export const RegistrationRoutes: FC = () => {
  return (
    <RegistrationNavigation.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9765A8",
        },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <RegistrationNavigation.Screen
        component={Screens.InputNickname}
        name={"InputNickName"}
        options={{ title: Core.i18n.t("323361e3-4ef1-4935-b3b2-03494b482a77") }}
      />
      <RegistrationNavigation.Screen
        component={Screens.InputImageAndBirthday}
        name={"SelectImageAndInputBirthday"}
        options={{
          title: Core.i18n.t("599a5dcc-8f8b-4da6-b588-5c260ac67a63"),
          headerBackVisible: false,
        }}
      />
    </RegistrationNavigation.Navigator>
  );
};

export type RegistrationStackList = {
  InputNickName: undefined;
  SelectImageAndInputBirthday: undefined;
};
export type RegistrationScreenProps<T extends keyof RegistrationStackList> = FC<
  NativeStackScreenProps<RegistrationStackList, T>
>;

const styles = StyleSheet.create({
  meditationName: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Core.gStyle.font("700"),
    textAlign: "center",
    width: "100%",
    height: 20,
  },
  meditationType: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Core.gStyle.font("400"),
    textAlign: "center",
  },
  screenLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9765A8",
  },
  tabBarBackground: {
    flexDirection: "row",
    height: 74,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
