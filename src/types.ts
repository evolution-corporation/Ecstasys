/** @format */

import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import type { useAppSelector, useAppDispatch } from "./store";
import { ImageSourcePropType } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

/** Пол пользователя */
export enum Gender {
	/** Мужской */
	MALE = "MALE",
	/** Женский */
	FEMALE = "FEMALE",
	/** Другой/неопределенно */
	OTHER = "OTHER",
}

/** Тип подписки пользователя строковой формат */
export enum SubscribeType {
	/** Пробная подписка в длинною 7 дней */
	WEEK = "WEEK",
	/** Подписка при которой будет происходить ежемесячное списание средств */
	MONTH = "MONTH",
	/** Подписка при которой будет происходить списание средств раз в 6 месяцев */
	HALF_YEAR = "HALF_YEAR",
}

/** Практики медитаций поддерживаемы приложением */
export enum PracticesMeditation {
	/** Релаксации */
	RELAXATION = "relaxation",
	/** Дыхательные практики */
	BREATHING_PRACTICES = "breathingPractices",
	/** Практики направленной визуализации */
	DIRECTIONAL_VISUALIZATIONS = "directionalVisualizations",
	/** Танцевальные практики */
	DANCE_PSYCHOTECHNICS = "dancePsychotechnics",
	/** Практики базовой медитации */
	BASIC = "basic",
}
/** Список экранов с приветствием */
export enum GreetingScreen {
	INTRO = "Intro",
	GREETING = "Greeting",
	DESCRIPTION_PRACTICES = "DescriptionPractices",
	DESCRIPTION_DMD = "DescriptionDMD",
}

/** Статус авторизации аккаунта в приложении */
export enum AccountStatus {
	/** Данные пользователя найдены в системе Evolution и в Firebase */
	REGISTRATION,
	/** Данные пользователя не найдены в системе Evolution, но его данные найдены в Firebase */
	NO_REGISTRATION,
	/** Данные пользователя не найдены в системе Evolution и в Firebase */
	NO_AUTHENTICATION,
}

// !
export enum StatisticPeriod {
	WEEK = "WEEK",
	MONTH = "MONTH",
	ALL = "ALL",
}

// состояния
export namespace State {
	export type Gender = "MALE" | "FEMALE" | "OTHER";
	export type AccountStatus = "REGISTRATION" | "NO_REGISTRATION" | "NO_AUTHENTICATION";
	export type PracticesMeditation =
		| "BASIC"
		| "BREATHING_PRACTICES"
		| "DANCE_PSYCHOTECHNICS"
		| "DIRECTIONAL_VISUALIZATIONS"
		| "RELAXATION";
	export type SubscribeType = "WEEK" | "MONTH" | "HALF_YEAR";
	export interface User {
		/** Уникальный идентификатор пользователя в Firebase */
		readonly uid: string;
		/**	Отображаемое имя пользователя */
		readonly displayName?: string;
		/** Ссылка на изображения пользователя */
		readonly image: string;
		/** Дата рождения пользователя */
		readonly birthday: string;
		/** Уникальное имя пользователя */
		readonly nickName: string;
		/** Пол пользователя */
		readonly gender: Gender;
	}
	export interface Account {
		/** Уникальный идентификатор пользователя в системе */
		readonly uid?: string;
		/** Статус авторизации пользователя */
		readonly status: AccountStatus;
		/** Пользовательские данные аккаунта */
		readonly userData?: User;
		/** Измененные, но не сохраненные пользователем данные */
		readonly changeUserData: ChangedUserData;
		//!
		readonly subscribe: State.Subscribe | null;
	}
	export interface Instruction {
		readonly id: string;
		readonly title: string;
		readonly description: string;
		readonly body: { text: string }[];
	}
	export interface ChangedUserData {
		/** Обновленное уникальное имя пользователя */
		readonly nickname?: string;
		/** Новое изображения пользователя в Base64 */
		readonly image?: string;
		/** Новое отображаемое имя пользователя */
		readonly displayName?: string;
		/** Обновленная дата рождения пользователя */
		readonly birthday?: string;
		/** Когда был проверка вернула успешный результат nickname на валидность */
		readonly lastCheckNicknameAndResult?: [string, boolean];
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
		selectSet: State.Set;
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
		timeNotification?: { type: Breathing; time: number }[];
		selectSet?: State.Set;
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
	ResultSubscribeScreen: {
		status: "Edit" | "Designations";
	};
	NoExitMeditation: undefined;
	InstructionForDMD: undefined;
	EndMeditation: undefined;
};

export type RootScreenProps<T extends keyof RootStackList> = FC<NativeStackScreenProps<RootStackList, T>>;

export enum Breathing {
	Active,
	Spontaneous,
	Free,
}
