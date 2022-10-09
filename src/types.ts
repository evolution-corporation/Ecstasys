/** @format */

import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native";
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

export type ChangedAccountDataJSON = ChangedAccountDataGeneral<SupportType.DateISOString>;
export type ChangedAccountData = ChangedAccountDataGeneral<Date>;

export namespace SupportType {
	export type DateISOString = string;
	export type Guid = string | null;
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
export type SubscribeType = "Week" | "Month" | "Month6";
type TimeMeditation = "LessThan15Minutes" | "MoreThan15AndLessThan60Minutes" | "MoreThan60Minutes";
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

	export interface Meditation {
		readonly id: SupportType.Guid;
		readonly Language?: string;
		readonly Name?: string;
		readonly Description?: string;
		readonly TypeMeditation: TypeMeditation;
		readonly Time: TimeMeditation;
		readonly IsSubscribed: boolean;
		readonly HasAudio: boolean;
		readonly AudioLength: number;
	}

	export interface Subscribe {
		readonly UserId: string;
		readonly WhenSubscribe: SupportType.DateISOString;
		readonly RemainingTime: number;
		readonly Type: SubscribeType;
		readonly RebillId: number;
	}

	export interface Payment {
		readonly Id: string;
		readonly UserId: string;
		readonly Amount: number;
		readonly PaymentDateTime: SupportType.DateISOString;
		readonly RecurrentPayment: boolean;
		readonly Confirm: boolean;
	}
}

// routing

export type TabNavigatorList = {
	Profile: undefined;
	Main: undefined;
	PracticesList: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorList> = FC<
	BottomTabScreenProps<TabNavigatorList, T> & {
		appDispatch?: ReturnType<typeof useAppDispatch>;
	}
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

export type MeditationPracticesScreenProps<T extends keyof MeditationPracticesList> = FC<
	NativeStackScreenProps<MeditationPracticesList, T> & {
		appDispatch?: ReturnType<typeof useAppDispatch>;
	}
>;

export type RootStackList = {
	TabNavigator: NavigatorScreenParams<TabNavigatorList>;
	EditMainUserData: undefined;
	EditUserBirthday: undefined;
	SelectSubscribe: undefined;
	MeditationPracticeList: {
		typeMeditation: TypeMeditation;
	};
	ListenMeditation: {
		meditationId: string;
	};
	IntroPractices: undefined;
	Greeting: undefined;
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
	InputNickname: undefined;
	InputImageAndBirthday: undefined;
};

export type RootScreenProps<T extends keyof RootStackList> = FC<
	NativeStackScreenProps<RootStackList, T> & {
		appDispatch?: ReturnType<typeof useAppDispatch>;
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
