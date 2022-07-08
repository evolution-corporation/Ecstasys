import React, { FC } from "react";

import Main from "~screens/Main";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectMood from "~screens/SelectMood";
import EditMeditationsParameters from "~screens/EditMeditationsParameters";
const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootRoutes: FC<{}> = () => (
  <RootStack.Navigator
    initialRouteName="Main"
    screenOptions={{
      animationTypeForReplace: "push",
      animation: "default",
      headerTransparent: true,
    }}
  >
    <RootStack.Screen
      component={Main}
      name="Main"
      options={{ headerShown: false }}
    />
    <RootStack.Screen component={SelectMood} name="SelectMood" />
    <RootStack.Screen
      component={EditMeditationsParameters}
      name="EditMeditationsParameters"
    />
  </RootStack.Navigator>
);

export default RootRoutes;
