import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import type { useAppSelector, useAppDispatch } from "./store";
// redux

export interface AccountGeneral<birthday> {
  readonly uid: string;
  displayName?: string;
  image: string;
  birthday: (SupportType.DateISOString | Date) & birthday;
  nickName: string;
}

export type AccountJSON = AccountGeneral<SupportType.DateISOString>;
export type Account = AccountGeneral<Date>;

export enum AccountStatus {
  REGISTRATION,
  NO_REGISTRATION,
  NO_AUTHENTICATION,
}

// TODO найти лучшее решение
export interface ChangedAccountDataGeneral<birthday> {
  nickname?: string;
  image?: string;
  displayName?: string;

  birthday?: (SupportType.DateISOString | Date) & birthday;
}

export type ChangedAccountDataJSON =
  ChangedAccountDataGeneral<SupportType.DateISOString>;
export type ChangedAccountData = ChangedAccountDataGeneral<Date>;

export namespace SupportType {
  export type DateISOString = string;
}

type Role = "ADMIN" | "USER";
type Gender = "MALE" | "FEMALE" | "OTHER";
type Category =
  | "NULL"
  | "BLOGGER"
  | "COMMUNITY"
  | "ORGANIZATION"
  | "EDITOR"
  | "WRITER"
  | "GARDENER"
  | "FLOWER_MAN"
  | "PHOTOGRAPHER";

// server

export namespace ServerEntities {
  export interface User {
    readonly Id: string;
    readonly NickName: string;
    readonly Birthday: string;
    readonly DisplayName?: string;
    readonly Status?: string;
    readonly UserRole: Role;
    readonly UserGender: Gender;
    readonly UserCategory: Category;
    readonly DateTimeRegistration: string;
    readonly HasPhoto: boolean;
    readonly IsSubscribe: boolean;
  }
}

export namespace ServerControllers {
  export namespace user {
    export type GET = (params: {
      user_id: string;
    }) => Promise<ServerEntities.User | null>;

    export type POST = (body: {
      NickName: string;
      Birthday: string;
      Status?: string;
      Gender?: Gender;
      Category?: Category;
      Image?: string;
      DisplayName?: string;
      ExpoToken?: string;
    }) => Promise<ServerEntities.User>;

    export type PATCH = (body: {
      NickName?: string;
      Birthday?: string;
      Status?: string;
      Gender?: Gender;
      Category?: Category;
      Image?: string;
      DisplayName?: string;
    }) => Promise<ServerEntities.User>;
  }

  export namespace nickname {
    export type GET = (params: {
      nickname: string;
    }) => Promise<ServerEntities.User | null>;
  }
}

// routing

export type TabNavigatorList = {
  Profile: undefined;
  Main: undefined;
  PracticesList: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorList> = FC<
  BottomTabScreenProps<TabNavigatorList, T>
>;

export type TabCompositeStackNavigatorProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorList, "Main">,
  BottomTabNavigationProp<TabNavigatorList, "PracticesList">
>;

export type MeditationPracticesList = {
  TimerPractices: undefined;
  PlayerScreen: undefined;
  BackgroundSound: undefined;
};

export type MeditationPracticesScreenProps<
  T extends keyof MeditationPracticesList
> = FC<NativeStackScreenProps<MeditationPracticesList, T>>;

export type RootStackList = {
  TabNavigator: NavigatorScreenParams<TabNavigatorList>;
  EditUserData: undefined;
  EditUserBirthday: undefined;
  SelectSubscribe: undefined;
  SelectPractices: {
    typeMeditation: TypeMeditation;
  };
  ListenMeditation: {
    meditationId: string;
  };
  IntroPractices: undefined;
  IntroMainScreen: undefined;
  Instruction: {
    // instruction: Instruction;
    typeMeditationName: string;
  };
  FavoriteMeditation: undefined;
  OptionsProfile: undefined;
  devSetting: undefined;
  Payment: undefined;
  Intro: undefined;
  SelectMethodAuthentication: undefined;
  InputNumberPhone: undefined;
  InputSMSCode: {
    phoneNumber: string;
  };
  InputNickName: undefined;
  SelectImageAndInputBirthday: undefined;
};

export type RootScreenProps<T extends keyof RootStackList> = FC<
  NativeStackScreenProps<RootStackList, T> & {
    appDispatch?: typeof useAppSelector;
  }
>;

export type TypeMeditation =
  | "relaxation"
  | "breathingPractices"
  | "directionalVisualizations"
  | "dancePsychotechnics"
  | "basic"
  | "DMD";

export interface Meditation {
  id: string;
  lengthAudio: number;
  name: string;
  type: TypeMeditation;
  image: string;
  description: string;
  audio?: string;
  audioId?: string;
  permission: boolean;
  instruction?: Instruction;
}

export interface Instruction {
  title: string;
  description: string;
  data: { image?: string; text: string }[];
}
