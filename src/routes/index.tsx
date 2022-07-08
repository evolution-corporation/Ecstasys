import React, { FC } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { useFlipper } from "@react-navigation/devtools";
import RootRoutes from "./Root";
import AuthorizationRoutes from "./Authorization";
import RegistrationRoutes from "./Registration";
import { LoadingStatus, AuthenticationStatus } from "~constants";

const Routes: FC<{
  authenticationStatus: AuthenticationStatus;
  isRegistration: boolean;
}> = ({ authenticationStatus, isRegistration }) => {
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  return (
    <NavigationContainer ref={navigationRef}>
      {authenticationStatus == AuthenticationStatus.NO_AUTHORIZED ? (
        <AuthorizationRoutes />
      ) : !isRegistration ? (
        <RegistrationRoutes />
      ) : (
        <RootRoutes />
      )}
    </NavigationContainer>
  );
};

export default Routes;
