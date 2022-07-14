import React, { FC, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NumberInput from "~screens/NumberInput";
import SMSCodeInput from "~screens/SMSCodeInput";
import AuthorizationWithPhoneContexts from "~contexts/authorizationWithPhone";
import useAuthorizationWithPhoneHook from "~hooks/useAuthorizationWithPhone";

const AuthorizationByPhoneStack =
  createNativeStackNavigator<AuthorizationByPhoneParamList>();

const AuthorizationByPhoneRoutes: FC<{}> = () => {
  const authorizationWithPhone = useAuthorizationWithPhoneHook();
  AuthorizationWithPhoneContexts.displayName = "AuthorizationWithPhoneContexts";
  return (
    <AuthorizationWithPhoneContexts.Provider value={authorizationWithPhone}>
      <AuthorizationByPhoneStack.Navigator
        initialRouteName="NumberInput"
        screenOptions={{
          animationTypeForReplace: "pop",
          animation: "default",
          headerTransparent: true,
          headerShown: true,
        }}
      >
        <AuthorizationByPhoneStack.Screen
          component={NumberInput}
          name="NumberInput"
        />
        <AuthorizationByPhoneStack.Screen
          component={SMSCodeInput}
          name="SMSCodeInput"
        />
      </AuthorizationByPhoneStack.Navigator>
    </AuthorizationWithPhoneContexts.Provider>
  );
};

export default AuthorizationByPhoneRoutes;
