import React, { FC, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NumberInput from "~screens/NumberInput";
import SMSCodeInput from "~screens/SMSCodeInput";
import AuthorizationWithPhoneContexts from "~contexts/authorizationWithPhone";
import useAuthorizationWithPhoneHook from "~hooks/useAuthorizationWithPhone";
import i18n from "~i18n";
import { colors } from "~styles";

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
          headerShown: true,
          headerStyle: { backgroundColor: colors.moreViolet },
          headerTintColor: colors.white,
        }}
      >
        <AuthorizationByPhoneStack.Screen
          component={NumberInput}
          name="NumberInput"
          options={{
            title: i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae"),
          }}
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
