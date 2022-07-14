import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { AuthenticationStatus } from "~constants";
import { authentication } from "~api/user";
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
        const data = await authentication();
        setIsRegistration(data != null);
        setAuthenticationStatus(AuthenticationStatus.AUTHORIZED);
      } else {
        setAuthenticationStatus(AuthenticationStatus.NO_AUTHORIZED);
      }
    });
  }, [setIsRegistration]);

  return { authenticationStatus, isRegistration };
}
