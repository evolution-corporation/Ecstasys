import React, { ComponentType, FC } from "react";

import useAccountHook from "./useAccountHook";
import {
  AccountAuthentication,
  AccountRegistration,
  Profile,
} from "./TestScreens";
import AccountContext, {
  useAccountContext,
  useUserContext,
  useTimerSMSRequestContext,
} from "./AccountContext";

const e = React.createElement;

const Account: FC<Props> = (props) => {
  const {
    authorization = AccountAuthentication,
    registration = AccountRegistration,
    root = Profile,
    dev_screen,
  } = props;
  const { state, func } = useAccountHook();

  return e(
    AccountContext.Provider,
    { value: { user: state.userData, func: func, state: state } },
    !!dev_screen
      ? e(dev_screen)
      : state.authenticationStatus === "noAuthentication"
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
  dev_screen?: ComponentType;
}

const contextHook = {
  account: useAccountContext,
  user: useAccountContext,
  timerSMSRequest: useTimerSMSRequestContext,
};

export default Account;
export { useUserContext, AccountContext, contextHook };
