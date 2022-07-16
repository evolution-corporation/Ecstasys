import React, { FC } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "~screens/Main";
import PracticesScreen from "~screens/Practices";
import Icon from "~assets/icons";
import { View } from "react-native";

const TabNavigator = createBottomTabNavigator<TabNavigatorParametersList>();

const TabNavigatorRouter: FC<RootStackScreenProps<"TabNavigator">> = ({}) => {
  return (
    <TabNavigator.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <TabNavigator.Screen
        name="Main"
        component={MainScreen}
        options={() => ({
          tabBarIcon: ({ focused }) => (
            <Icon name={"Home"} variable={focused ? "violet" : "white"} />
          ),
        })}
      />
      <TabNavigator.Screen
        name="Practices"
        component={PracticesScreen}
        options={() => ({
          tabBarIcon: ({ focused }) => (
            <Icon name={"Sun"} variable={focused ? "violet" : "gray"} />
          ),
          tabBarBackground: () => (
            <View style={{ backgroundColor: "#A7A9E0", flex: 1 }} />
          ),
        })}
      />
    </TabNavigator.Navigator>
  );
};

export default TabNavigatorRouter;
