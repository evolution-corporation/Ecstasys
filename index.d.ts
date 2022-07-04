declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare type ActionReducer =
  | ActionReducerNoWithPayload
  | ActionReducerWithPayload;

declare type ActionReducerWithPayload<T, P> = { type: T; payload: P };
declare type ActionReducerNoWithPayload<T> = { type: T };

declare type PositionComponent = { x: number; y: number };

declare type ScreenName =
  | "Main"
  | "SelectMoon"
  | "SelectionMeditationsParameters"
  | "Player";

declare type AppController = {
  goBack: () => void;
  editScreen: (screenName: ScreenName, data?: any) => void;
};

declare type ScreenPropsWithUserData = ScreenProps & {
  accountInformation: UserAccount;
};

declare type ScreenProps = {
  appController: AppController;
  isActiveScreen: 0 | 1 | 2;
  screenControl?: RefObject<ScreenRef>;
  isFocused?: boolean;
};

declare type optionScreenRef = {
  setParams: (data: any) => void;
};
