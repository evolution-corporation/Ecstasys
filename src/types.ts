/** @format */

import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import type { useAppSelector, useAppDispatch } from "./store";
import { ImageSourcePropType } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Gender, PracticesMeditation, SubscribeType } from "./enum";

/** Список экранов с приветствием */
export enum GreetingScreen {
	INTRO = "Intro",
	GREETING = "Greeting",
	DESCRIPTION_PRACTICES = "DescriptionPractices",
	DESCRIPTION_DMD = "DescriptionDMD",
}

// !
export enum StatisticPeriod {
	WEEK = "WEEK",
	MONTH = "MONTH",
	ALL = "ALL",
}

export interface UserInformation {
	displayName?: string;
	nickname: string;
	birthday: Date;
	image?: string;
	gender: Gender;
	id: string;
}

export interface SubscribeInformation {
	type: SubscribeType;
	whenSubscribe: Date;
	autoPayment: boolean;
}

export interface PracticeInformation {
	id: string;
	description: string;
	name: string;
	instruction: {
		id: string;
		title: string;
		description: string;
		body: { text: string }[];
	};
	image: string;
	type: PracticesMeditation;
	audio?: string;
	isNeedSubscribe: boolean;
	length: number;
}

export interface DMDInformation {
	id: string;
	name: string;
	audio: string;
	isNeedSubscribe: boolean;
	length: number;
}

export type Serialization<Type> = {
	[Property in keyof Type]: Type[Property] extends Date
		? string
		: Type[Property] extends number
		? number
		: Type[Property] extends object
		? Serialization<Type[Property]>
		: Type[Property];
};

// состояния
export namespace State {
	export interface Instruction {
		readonly id: string;
		readonly title: string;
		readonly description: string;
		readonly body: { text: string }[];
	}

	export interface Practice {
		id: string;
		description: string;
		name: string;
		instruction: Instruction;
		image: string;
		type: State.PracticesMeditation;
		audio?: string;
		isNeedSubscribe: boolean;
		length: number;
	}

	export interface BasePractice {
		id: string;
		description: string;
		name: string;
		instruction: Instruction;
		image: ImageSourcePropType;
	}
	export interface StatisticUnit {
		id: string;
		dateListen: string;
		timeListen: number;
		meditation: Practice;
	}
	export interface Statistic {
		[index: string]: State.StatisticUnit;
	}

	export type FavoritePractices = Practice[];

	export interface MessageProfessor {
		idMessage: string;
		dateTimeLastUpdate: string;
	}

	export interface Subscribe {
		type: State.SubscribeType;
		whenSubscribe: string;
		autoPayment: boolean;
	}

	export interface Set {
		id: string;
		name: string;
		audio: string;
		length: number;
	}
}

// routing

export type TabNavigatorList = {
	Profile: undefined;
	Main: undefined;
	PracticesList: undefined;
	RelaxListForDMD: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorList> = FC<BottomTabScreenProps<TabNavigatorList, T>>;

export type GeneralCompositeScreenProps = FC<
	CompositeScreenProps<BottomTabScreenProps<TabNavigatorList>, BottomTabScreenProps<RootStackList>>
>;

// export type TabAndProfileCompositeNavigation = CompositeNavigationProp<
// 	BottomTabNavigationProp<TabNavigatorList, "Main">,
// 	CompositeNavigationProp<
// 		BottomTabNavigationProp<TabNavigatorList, "PracticesList">,
// 		CompositeNavigationProp<BottomTabNavigationProp<TabNavigatorList, "RelaxListForDMD">>
// 	>
// >;

export type MeditationPracticesList = {
	TimerPractices: undefined;
	PlayerScreen: undefined;
	BackgroundSound: undefined;
};

export type MeditationPracticesScreenProps<T extends keyof MeditationPracticesList> = FC<
	NativeStackScreenProps<MeditationPracticesList, T>
>;

export type RootStackList = {
	TabNavigator: NavigatorScreenParams<TabNavigatorList>;
	EditUser: undefined;
	EditUserBirthday: undefined;
	SelectSubscribe: undefined;
	PracticeListByType: {
		typePractices: PracticesMeditation;
	};
	IntroPractices: undefined;
	Greeting: undefined;
	Instruction: {
		instruction: State.Instruction;
	};
	FavoriteMeditation: undefined;
	Options: undefined;
	devSetting: undefined;
	IntroAboutApp: undefined;
	IntroAboutYou: undefined;
	SelectMethodAuthentication: undefined;
	InputNumberPhone: undefined;
	InputSMSCode: {
		phoneNumber: string;
	};
	InputNickname: undefined;
	InputImageAndBirthday: undefined;
	PlayerForRelaxation: {
		selectedPractice: State.Practice;
		practiceLength: number;
	};
	SelectTimeForRelax: {
		selectedPractice: State.Practice;
	};
	PlayerForDMD: {
		selectedRelax: State.Practice & { type: "RELAXATION" };
	};
	DMDSettingNotification: {
		selectedRelax: State.Practice & { type: "RELAXATION" };
	};
	SelectBackgroundSound: {
		backgroundImage?: ImageSourcePropType;
	};
	Error: {
		message: string;
	};
	DMDSelectTimeBright: {
		type: "activate" | "random";
	};
	MessageLog: {
		title?: string;
		message: string;
		result: "Resolve" | "Reject" | "Loading" | "Info";
	};
	SelectSet: {
		selectedRelax: State.Practice & { type: "RELAXATION" };
	};
	DMDIntro: undefined;
	PlayerForPractice: {
		selectedPractice: State.Practice;
	};
	PlayerMeditationOnTheMandala: {
		isNeedVoice: boolean;
		practiceLength: number;
	};
	SelectTimeForBase: {
		selectedPractice: State.BasePractice;
	};
	PlayerMeditationOnTheNose: {
		isNeedVoice: boolean;
		practiceLength: number;
	};
	Payment: {
		selectSubscribe: State.SubscribeType;
	};
	ConfirmationSignOut: undefined;
	InputNameAndSelectGender: undefined;
	ByMaySubscribe: undefined;
	PlayerMeditationDot: {
		isNeedVoice: boolean;
		practiceLength: number;
	};
};

export type RootScreenProps<T extends keyof RootStackList> = FC<NativeStackScreenProps<RootStackList, T>>;

export type CanSerialization<T> = {
	toSerialization: () => Serialization<T>;
};

declare global {
	interface String {
		toPascalCase: () => string;
	}
}
