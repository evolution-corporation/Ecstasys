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

declare interface UserData extends UserMinimalData {
  uid: string;
  status?: string;
  role: UserRole;
  gender: UserGender;
  category: UserCategory;
  imageId?: string;
  subscribeInfo?: SubscribeInfo;
}

declare type UserMood =
  | "IRRITATION"
  | "ANXIETY"
  | "CONCENTRATION"
  | "HAPPINESS";

declare interface UserMinimalData {
  nickName: string;
  birthday: string;
  image?: string;
  displayName?: string;
}

declare interface MeditationData {
  id: string;
  lengthAudio: number;
  name: string;
  type: TypeMeditation;
  image: string;
  description: string;
  imageId: string;
  audio?: string;
  audioId?: string;
  permission: boolean;
}

declare type CountDay_ParameterMeditation = "2-3days" | "4-5days" | "6-7days";
declare type Time_ParameterMeditation =
  | "lessThan15minutes"
  | "moreThan15AndLessThan60Minutes"
  | "moreThan60Minutes";
declare interface ParametersMeditation {
  countDay: CountDay_ParameterMeditation;
  time: Time_ParameterMeditation;
  type: TypeMeditation[];
}

declare interface WeekStatistic {
  count: number;
  time: number;
}

declare type UserRole = "NO_REGISTRATION" | "USER" | "ADMIN";
declare type UserGender = "MALE" | "FEMALE" | "OTHER";

declare type UserCategory =
  | "BLOGGER"
  | "COMMUNITY"
  | "ORGANIZATION"
  | "EDITOR"
  | "WRITER"
  | "GARDENER"
  | "FLOWER_MAN"
  | "PHOTOGRAPHER";

declare type TypeMeditation = Practices | "DMD";

declare type PracticesMeditation =
  | "relaxation"
  | "breathingPractices"
  | "directionalVisualizations"
  | "dancePsychotechnics";

declare type RequestSMSCodeFunction = {
  (
    numberPhone: string,
    numberPhoneIsValidate: boolean
  ): Promise<CheckSMSCodeFunction>;
};

declare type SubscribeInfo = {
  id: string;
  dateEndSubscribe: string;
};

declare type BackgroundMusic = "Test" | "Test2";
