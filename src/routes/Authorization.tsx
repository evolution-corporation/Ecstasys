import React, { FC } from "react";

import AuthorizationByPhone from "~screens/AuthorizationByPhone";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AuthorizationStack =
  createNativeStackNavigator<AuthorizationStackParamList>();

const AuthorizationRoutes: FC<{}> = () => (
  <AuthorizationStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthorizationStack.Screen
      component={AuthorizationByPhone}
      name="AuthorizationByPhone"
    />
  </AuthorizationStack.Navigator>
);

export default AuthorizationRoutes;
