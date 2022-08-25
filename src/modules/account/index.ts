import React, { ComponentType, FC } from "react";

import useAccountHook from "./useAccountHook";
import { AccountAuthentication, AccountRegistration } from "./TestScreens";
import AccountContext, {
  useAccountContext,
  useUserContext,
  useTimerSMSRequestContext,
} from "./AccountContext";
import { View } from "react-native";

const e = React.createElement;

const Account: FC<Props> = (props) => {
  const {
    authorization = AccountAuthentication,
    registration = AccountRegistration,
    root = View,
  } = props;
  const { state, func } = useAccountHook();

  return e(
    AccountContext.Provider,
    { value: { user: state.userData, func: func, state: state } },
    state.authenticationStatus === "noAuthentication"
      ? e(authorization)
      : state.registrationStatus === "noRegistration"
      ? e(registration)
      : e(root)
  );
};

interface Props {
  authorization?: ComponentType;
  registration?: ComponentType;
  root?: ComponentType;
}

const contextHook = {
  account: useAccountContext,
  user: useAccountContext,
  timerSMSRequest: useTimerSMSRequestContext,
};

export default Account;
export { useUserContext, AccountContext, contextHook };
