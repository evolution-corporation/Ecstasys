import React, { FC } from "react";

import Registration from "~screens/Registration";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RegistrationStack =
  createNativeStackNavigator<RegistrationStackParamList>();

const RegistrationRoutes: FC<{}> = () => (
  <RegistrationStack.Navigator screenOptions={{ headerShown: false }}>
    <RegistrationStack.Screen component={Registration} name="Registration" />
  </RegistrationStack.Navigator>
);

export default RegistrationRoutes;
