import React, { FC, useState } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PracticesScreen from "~screens/Practices";
import ProfileScreen from "~screens/Profile";
import MainStack from "./Main";
import Icon from "~assets/icons";
import { View } from "react-native";
import StartScreen from "~screens/Start";

const TabNavigator = createBottomTabNavigator<TabNavigatorParametersList>();
const TabNavigatorRouter: FC<RootStackScreenProps<"TabNavigator">> = ({}) => {
  return (
    <TabNavigator.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <TabNavigator.Screen
        name="Start"
        component={StartScreen}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                name={"Home"}
                key={route.name}
                variable={focused ? "violet" : "white"}
              />
            );
          },
        })}
      />
      <TabNavigator.Screen
        name="Practices"
        component={PracticesScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, focused }) => {
            // console.log(route);
            return <Icon name={"Sun"} variable={focused ? "violet" : "gray"} />;
          },
        })}
      />
    </TabNavigator.Navigator>
  );
};

export default TabNavigatorRouter;
