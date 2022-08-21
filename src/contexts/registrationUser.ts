import { createContext, Dispatch } from "react";

const registrationUserContext = createContext<{
  nickname: Dispatch<string>;
  birthday: Dispatch<Date>;
  image: Dispatch<string>;
  registration: (
    nickname: null | string,
    birthday: null | Date,
    image: string | null
  ) => Promise<void>;
} | null>(null);
registrationUserContext.displayName = "registrationUserContext";
export default registrationUserContext;
