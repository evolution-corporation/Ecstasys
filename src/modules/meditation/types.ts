// node-modules
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { FC } from "react";
import { Audio } from "expo-av";
import { ImageProps } from "react-native";

// application alias

// in module import
export type MeditationStackList = {};
export type MeditationScreenProps<T extends keyof MeditationStackList> = FC<
  NativeStackScreenProps<MeditationStackList, T>
>;

export type Practices =
  | "relaxation"
  | "breathingPractices"
  | "directionalVisualizations"
  | "dancePsychotechnics"
  | "basic";

export type TypeMeditation = Practices | "DMD";

export type LengthMeditation =
  | "lessThan15minutes"
  | "moreThan15AndLessThan60Minutes"
  | "moreThan60Minutes";

export type CountMeditationInWee = "2-3days" | "4-5days" | "6-7days";

export type MeditationPreferences = {
  countInWeek: CountMeditationInWee;
  length: LengthMeditation;
  type: TypeMeditation[];
};

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

export interface MeditationAudio {
  length: number;
  sound: Audio.Sound;
}

export interface BackgroundAudio {
  sound: Audio.Sound;
  name: string;
  // image: string;
}

export type DMDAudio = { name: string; data: MeditationAudio };

export interface TypeDMDNotification {
  name: string;
  audio: Audio.Sound;
  text: string;
}

export interface Instruction {
  title: string;
  description: string;
  data: { image?: string; text: string }[];
}
