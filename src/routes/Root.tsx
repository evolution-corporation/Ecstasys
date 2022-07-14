import React, { FC } from "react";

import Main from "~screens/Main";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectMood from "~screens/SelectMood";
import EditMeditationsParameters from "./EditMeditationsParameters";
import i18n from "~i18n";
import MeditationListenerRoutes from "./MeditationListener";
const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootRoutes: FC<{}> = () => (
  <RootStack.Navigator
    initialRouteName="Main"
    screenOptions={{
      animationTypeForReplace: "push",
      animation: "default",
      headerTransparent: true,
      headerShown: false,
    }}
  >
    <RootStack.Screen component={Main} name="Main" />
    <RootStack.Screen component={SelectMood} name="SelectMood" />
    <RootStack.Screen
      component={EditMeditationsParameters}
      name="EditMeditationsParameters"
    />
    <RootStack.Screen
      component={MeditationListenerRoutes}
      name={"MeditationListener"}
    />
  </RootStack.Navigator>
);

export default RootRoutes;
