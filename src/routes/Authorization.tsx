import React, { FC } from "react";

import AuthorizationByPhone from "./AuthorizationByPhone";
import SelectMethodAuthentication from "~screens/SelectMethodAuthentication";
import Intro from "~screens/Intro";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const AuthorizationStack =
  createNativeStackNavigator<AuthorizationStackParamList>();

const AuthorizationRoutes: FC<{}> = () => (
  <AuthorizationStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthorizationStack.Screen component={Intro} name={"Intro"} />
    <AuthorizationStack.Screen
      component={SelectMethodAuthentication}
      name={"SelectMethodAuthentication"}
    />
    <AuthorizationStack.Screen
      component={AuthorizationByPhone}
      name="AuthorizationByPhone"
      options={{ headerShown: false }}
    />
  </AuthorizationStack.Navigator>
);

export default AuthorizationRoutes;
