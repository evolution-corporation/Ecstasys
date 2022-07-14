import React, { FC } from "react";

import AuthorizationByPhone from "./AuthorizationByPhone";
import SelectMethodAuthentication from "~screens/SelectMethodAuthentication";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AuthorizationStack =
  createNativeStackNavigator<AuthorizationStackParamList>();

const AuthorizationRoutes: FC<{}> = () => (
  <AuthorizationStack.Navigator
    screenOptions={{ headerShown: true, headerTransparent: true }}
  >
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
