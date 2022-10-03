// @ts-ignore
import type { FC } from "react";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface UserDataApplication {
  displayName?: string;
  uid: string;
  subscribeInfo?: SubscribeInfo;
  image: string;
  birthday: Date;
  nickName: string;
}

export interface UserDataServer {
  status?: string;
  role: UserRole;
  gender: UserGender;
  category: UserCategory;
  displayName?: string;
  id: string;
  subscribeInfo?: SubscribeInfo;
  hasPhoto: boolean;
  birthday: string;
  nickName: string;
}

export interface UpdateUserData {
  display_name?: string;
  image?: string;
  birthday?: Date;
  nickName?: string;
}

export interface State {
  userData?: UserDataApplication;
  registrationStatus?: "registration" | "noRegistration";
  authenticationStatus: "authentication" | "noAuthentication";
  editUserData?: UpdateUserData;
  confirmResultByPhone?: FirebaseAuthTypes.ConfirmationResult;
  phone?: string;
}

export interface State_v2 extends State {
  isCanRequestSMSCode: boolean;
  timeLeft: number | null;
}

export type Action =
  | ActionReducerNoWithPayload<"out">
  | ActionReducerWithPayload<"in", UserDataApplication | null>
  | ActionReducerWithPayload<"edit", UpdateUserData>
  | ActionReducerWithPayload<"registration", UserDataApplication>
  | ActionReducerWithPayload<"update", UserDataApplication>
  | ActionReducerWithPayload<
      "authorizationByPhone",
      { confirm: FirebaseAuthTypes.ConfirmationResult; phone: string }
    >;

export interface Func {
  editUserData: (payload: UpdateUserData) => Promise<void>;
  registration: () => Promise<void>;
  update: () => Promise<void>;
  authenticationWithPhone: (phone: string) => Promise<void>;
  requestSMSCode: () => Promise<void>;
  checkSMSCode: (code: string) => Promise<void>;
}

export interface Func_V2 extends Func {
  authenticationWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authWithTestAccount: () => Promise<void>;
}
