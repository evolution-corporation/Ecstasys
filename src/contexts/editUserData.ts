import { createContext, Dispatch } from "react";

const editUserDataContext = createContext<{
  editName: Dispatch<string>;
  editSubname: Dispatch<string>;
  editNickname: Dispatch<string>;
  editBirthday: Dispatch<{ year: number; month: number; day: number }>;
  editImage: Dispatch<string>;
  modifiedUserData: {
    name?: string;
    subname?: string;
    nickname?: string;
    birthday?: { year: number; month: number; day: number };
  };
  saveData: () => Promise<void>;
} | null>(null);
editUserDataContext.displayName = "editUserDataContext";
export default editUserDataContext;
