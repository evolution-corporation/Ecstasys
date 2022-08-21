import React, { FC } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectMood from "~screens/SelectMood";
import EditMeditationsParameters from "./EditMeditationsParameters";
import i18n from "~i18n";
import MeditationListenerRoutes from "./MeditationListener";
import TabNavigatorRouter from "./TabNavigator";
import MeditationPracticeList from "~screens/MeditationPracticeList";
import ProfileScreen from "~screens/Profile";
import OptionsScreen from "~screens/Options";
import { TouchableOpacity } from "react-native";
import Icon from "~assets/icons";
import EditUserData from "./EditUserData";
import FavoriteMeditationScreen from "~screens/FavoriteMeditation";
import { colors } from "~styles";

const RootStack = createNativeStackNavigator<RootStackParametersList>();

const RootRoutes: FC<{}> = () => (
  <RootStack.Navigator
    initialRouteName="TabNavigator"
    screenOptions={{
      animationTypeForReplace: "push",
      animation: "default",
      headerTransparent: false,
      headerShown: false,
      headerStyle: { backgroundColor: colors.moreViolet },
      headerTintColor: colors.white,
    }}
  >
    <RootStack.Screen component={TabNavigatorRouter} name={"TabNavigator"} />
    <RootStack.Screen component={SelectMood} name="SelectMood" />
    <RootStack.Screen
      component={EditMeditationsParameters}
      name="EditMeditationsParameters"
    />
    <RootStack.Screen
      component={MeditationListenerRoutes}
      name={"MeditationListener"}
      initialParams={{ meditationID: "1054ce51-7ed2-4ed0-ab66-d6b53e15a88c" }}
    />
    <RootStack.Screen
      component={MeditationPracticeList}
      name={"MeditationPracticeList"}
      options={({ route }) => ({
        headerShown: true,
        title: i18n.getTypeMeditation(route.params.typeMeditation),
      })}
    />
    <RootStack.Screen
      component={ProfileScreen}
      name={"Profile"}
      options={({ navigation }) => ({
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Options")}>
            <Icon name={"ThreeLine"} />
          </TouchableOpacity>
        ),
      })}
    />
    <RootStack.Screen
      component={EditUserData}
      name={"EditUserData"}
      options={{
        headerShown: true,
        title: i18n.t("Profile"),
      }}
    />
    <RootStack.Screen
      component={OptionsScreen}
      name={"Options"}
      options={{
        headerShown: true,
        title: i18n.t("options"),
      }}
    />
    <RootStack.Screen
      name={"FavoriteMeditationList"}
      component={FavoriteMeditationScreen}
      options={{
        headerShown: true,
        title: i18n.t("favorite"),
      }}
    />
  </RootStack.Navigator>
);

export default RootRoutes;
