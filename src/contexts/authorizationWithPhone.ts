import { createContext } from "react";
import { AuthorizationWithPhone } from "~hooks/useAuthorizationWithPhone";

const AuthorizationWithPhoneContext =
  createContext<AuthorizationWithPhone | null>(null);
export default AuthorizationWithPhoneContext;
