import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { AuthenticationStatus } from "~constants";

import store from "~store";
import { loadingMeditationData } from "~store/meditation";
import { loadingAccountData, authentication } from "~store/account";
export default function useAuthorization(): {
  authenticationStatus: AuthenticationStatus;
  isRegistration: boolean;
} {
  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>(AuthenticationStatus.NONE);
  const [isRegistration, setIsRegistration] = useState<boolean>(false);

  useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (user != null) {
        const data = await store.dispatch(authentication());
        setIsRegistration(data != null);
        setAuthenticationStatus(AuthenticationStatus.AUTHORIZED);
      } else {
        setAuthenticationStatus(AuthenticationStatus.NO_AUTHORIZED);
      }
    });
  }, [setIsRegistration]);

  useEffect(() => {
    if (authenticationStatus == AuthenticationStatus.AUTHORIZED) {
      store.dispatch(loadingAccountData());
      store.dispatch(loadingMeditationData());
    }
  }, [authenticationStatus]);

  return { authenticationStatus, isRegistration };
}
