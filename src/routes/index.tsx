import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Audio } from "expo-av";

import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

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
import { useAppSelector } from "~store";
import {
  AccountStatus,
  MeditationPracticesList,
  RootScreenProps,
  RootStackList,
  TabNavigatorList,
} from "~types";

const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => {
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
          tabBarIcon: ({ focused, color }) => (
            <MainIcon
              colorIcon={
                focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"
              }
            />
          ),
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

const RootNavigation = createSharedElementStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
  const accountStatus = useAppSelector((state) => state.account.accountStatus);
  if (accountStatus === null) return null;
  return (
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
      {accountStatus === AccountStatus.NO_AUTHENTICATION ? (
        <>
          {/* Доступно только неавторизованным пользователя */}
          <RootNavigation.Screen
            name={"Intro"}
            options={{
              headerShown: false,
            }}
            component={Screens.Intro}
          />
          <RootNavigation.Screen
            name={"SelectMethodAuthentication"}
            component={Screens.SelectMethodAuthentication}
            options={{
              headerShown: false,
            }}
          />
          <RootNavigation.Screen
            name={"InputNumberPhone"}
            component={Screens.InputNumberPhone}
            options={{
              title: Core.i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae"),
            }}
          />
          <RootNavigation.Screen
            name={"InputSMSCode"}
            component={Screens.InputSMSCode}
            options={{
              title: "",
            }}
          />
        </>
      ) : accountStatus === AccountStatus.NO_REGISTRATION ? (
        <>
          {/* Доступно авторизированным, но не зарегистрированным */}
          <RootNavigation.Screen
            component={Screens.InputNickname}
            name={"InputNickName"}
            options={{
              title: Core.i18n.t("323361e3-4ef1-4935-b3b2-03494b482a77"),
            }}
          />
          <RootNavigation.Screen
            component={Screens.InputImageAndBirthday}
            name={"SelectImageAndInputBirthday"}
            options={{
              title: Core.i18n.t("599a5dcc-8f8b-4da6-b588-5c260ac67a63"),
            }}
          />
        </>
      ) : accountStatus === AccountStatus.REGISTRATION ? (
        <>
          {/* Доступно авторизированным и зарегистрированным */}
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
                      DescriptionMeditationCategory[
                        route.params.typeMeditationName
                      ].title
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
            name={"Payment"}
            component={Screens.PaymentWeb}
          />
        </>
      ) : null}
      {/* <RootNavigation.Screen
        name="devSetting"
        component={Screens.DevSettings}
        options={{
          title: Core.i18n.t("f56183f9-c95c-4e3c-965d-2eee5791d1d6"),
        }}
      /> */}
    </RootNavigation.Navigator>
  );
};

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

export default RootRoutes;
