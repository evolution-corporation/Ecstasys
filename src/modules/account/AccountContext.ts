import { createContext, useContext } from "react";
import { Func_V2, State_v2, UserDataApplication } from "~modules/account/types";

const AccountContext = createContext<{
  user: UserDataApplication | undefined;
  func: Func_V2;
  state: State_v2;
} | null>(null);

export function useAccountContext() {
  const accountState = useContext(AccountContext);
  if (!!accountState) return accountState;
  throw new Error("Account context not initialization");
}

export function useUserContext() {
  const context = useContext(AccountContext);
  if (!!context) {
    return { user: context.user, func: context.func };
  }
  throw new Error("User context not initialization");
}

export function useTimerSMSRequestContext() {
  const context = useContext(AccountContext);
  if (!!context) {
    return { timeLeft: context.state.timeLeft };
  }
  throw new Error("User context not initialization");
}

export default AccountContext;
