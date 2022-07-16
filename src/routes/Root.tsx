import React, { FC } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectMood from "~screens/SelectMood";
import EditMeditationsParameters from "./EditMeditationsParameters";
import i18n from "~i18n";
import MeditationListenerRoutes from "./MeditationListener";
import TabNavigatorRouter from "./TabNavigator";
import MeditationPracticeList from "~screens/MeditationPracticeList";
const RootStack = createNativeStackNavigator<RootStackParametersList>();

const RootRoutes: FC<{}> = () => (
  <RootStack.Navigator
    initialRouteName="TabNavigator"
    screenOptions={{
      animationTypeForReplace: "push",
      animation: "default",
      headerTransparent: true,
      headerShown: false,
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
      options={{ headerShown: true }}
    />
  </RootStack.Navigator>
);

export default RootRoutes;
