/**
 * @format
 * @description Хранит необходимы типы и интерфейсы для работы модуля
 */

import { Gender, GreetingScreen, PracticesMeditation } from "~types";
/**
 * Типы которые необходимы для обработки возвращаемых с сервера сущностей
 */
export namespace SupportType {
	/** Дата в формате строки ISO */
	export type DateISOString = string;
	/** UUID в формате строки */
	export type Guid = string;
	/** Роль пользователя строковой формат */
	export type Role = "ADMIN" | "USER";
	/** Пол пользователя строковой формат */
	export type Gender = "MALE" | "FEMALE" | "OTHER";
	/** Категория пользователя строковой формат */
	export type Category =
		| "NULL"
		| "BLOGGER"
		| "COMMUNITY"
		| "ORGANIZATION"
		| "EDITOR"
		| "WRITER"
		| "GARDENER"
		| "FLOWER_MAN"
		| "PHOTOGRAPHER";
	/** Тип подписки пользователя строковой формат */
	export type SubscribeType = "Week" | "Month" | "Month6";
	/** Тип медитации строковой */
	export type TypeMeditation =
		| "relaxation"
		| "breathingPractices"
		| "directionalVisualizations"
		| "dancePsychotechnics"
		| "set";

	/** Тип медитационной практики */
	export type PracticesMeditation =
		| "relaxation"
		| "breathingPractices"
		| "directionalVisualizations"
		| "dancePsychotechnics"
		| "base";
}

/** Модели сущностей которые возвращаются с сервера */
export namespace ServerEntities {
	/** Сущность Пользователя которая возвращается с сервера */
	export interface User {
		/** Уникальный идентификатор пользователя в Firebase */
		readonly Id: string;
		/** Уникальное имя пользователя */
		readonly NickName: string;
		/** Дата рождения пользователя */
		readonly Birthday: string;
		/**	Отображаемое имя пользователя */
		readonly DisplayName?: string;
		/** Сообщение пользователя, которое он оставил на своей странице */
		readonly Status?: string;
		/** Название к какой группе относится пользователь */
		readonly Role: SupportType.Role;
		/** Пол пользователя который он указал */
		readonly Gender: SupportType.Gender;
		/** Категория к деятельности пользователя, которую он указал */
		readonly Category: SupportType.Category;
		/** Дата регистрации пользователя */
		readonly DateTimeRegistration: string;
		/** Есть ли у пользователя изображение профиля */
		readonly HasPhoto: boolean;
		/** Есть ли у пользователя подписка */
		readonly IsSubscribe: boolean;
	}

	/** Сущность медитации которая возвращается с сервера */
	export interface Meditation {
		/** Идентификатор медитации в системе Evolution */
		readonly id: SupportType.Guid;
		/** Натуральный язык на котором получены данные об медитации */
		readonly Language?: string;
		/** Название медитации */
		readonly Name: string;
		/** Описание медитации */
		readonly Description?: string;
		/** Тип медитации */
		readonly TypeMeditation: SupportType.TypeMeditation;
		/** Требуется ли подписка, чтобы прослушать данную медитацию */
		readonly IsSubscribed: boolean;
		/** Если ли у данной медитации главная аудиозапись */
		readonly HasAudio: boolean;
		/** Длина аудиозаписи */
		readonly AudioLength: number;
	}

	/** Сущность подписки которая возвращается с сервера */
	export interface Subscribe {
		/** Идентификатор пользователя, которому принадлежит подписка информация которой получена */
		readonly UserId: string;
		/** Дата оформления подписки */
		readonly WhenSubscribe: SupportType.DateISOString;
		/** Оставшиеся время действия подписки */
		readonly RemainingTime: number;
		/** Тип оформляемой подписки */
		readonly Type: SupportType.SubscribeType;

		readonly RebillId: number;
	}
	/** Сущность платежа которая возвращается с сервера */
	export interface Payment {
		/** Уникальный индикатор платежа */
		readonly Id: string;
		/** Идентификатор пользователя, которому будет принадлежать подписка */
		readonly UserId: string;
		/** Сумма платежа в копейках */
		readonly Amount: number;
		/** Дата платежа */
		readonly PaymentDateTime: SupportType.DateISOString;
		/** Является ли платеж рекуррентным */
		readonly RecurrentPayment: boolean;
		/** Платеж успешно осуществлен */
		readonly Confirm: boolean;
	}
}

export interface Instruction {
	title: string;
	description: string;
	data: { image?: string; text: string }[];
}

/** Список экранов с приветствием и их статус */
export type StatusShowGreetingScreens = { readonly [key in GreetingScreen]: boolean };

/** Модели сущностей которые возвращаются с асинхронного хранилища */
export namespace AsyncStorageEntities {
	export interface Practices {
		/** Идентификатор медитационной практики в системе Evolution */
		readonly id: SupportType.Guid;
		/** Название медитационной практики */
		readonly name: string;
		/** Описание медитационной практики */
		readonly description: string;
		/** Тип медитационной практики */
		readonly typePractices: SupportType.PracticesMeditation;
		/** Ссылка на главную аудиозапись */
		readonly urlAudio?: string;
		/** Длина практики */
		readonly length: number;
	}

	/** Сущность Пользователя которая возвращается с асинхронного хранилища */
	export interface User {
		/** Уникальный идентификатор пользователя в Firebase */
		readonly id: string;
		/** Уникальное имя пользователя */
		readonly nickName: string;
		/** Дата рождения пользователя */
		readonly birthday: string;
		/**	Отображаемое имя пользователя */
		readonly displayName?: string;
		/** Пол пользователя который он указал */
		readonly gender: SupportType.Gender;
		/** Ссылка на изображение */
		readonly image: string;
	}

	//!
	export type Statistic = readonly {
		readonly id: string;
		readonly date: string;
		readonly time: number;
		readonly meditationId: string;
	}[];

	//!
	export type UsedMessage = readonly { id: string; dateLastUpdate: string; messageId: string }[];
}

export { Gender, GreetingScreen, PracticesMeditation };
