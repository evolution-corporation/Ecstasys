/**
 * Файл содержит классы которые возвращают функции обработчики
 * TODO Разобраться с медитативными инструкциями
 * @format */

import { ServerEntities, Gender, PracticesMeditation, Instruction } from "./types";
import { instructionForDirectionalVisualization, instructionForRelaxation } from "./instructionMeditation";
/** Хранит в себе информацию об пользователе  */
export class Users {
	/** Уникальный идентификатор пользователя в Firebase */
	public readonly uid: string;
	/**	Отображаемое имя пользователя */
	public readonly displayName?: string;
	/** Ссылка на изображения пользователя */
	public readonly image: string;
	/** Дата рождения пользователя */
	public readonly birthday: Date;
	/** Уникальное имя пользователя */
	public readonly nickName: string;
	/** Пол пользователя */
	public readonly gender?: Gender;

	constructor(data: ServerEntities.User) {
		let image = "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";
		if (data.HasPhoto) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/" + data.Id;
		this.uid = data.Id;
		this.nickName = data.NickName;
		this.image = image;
		this.birthday = new Date(data.Birthday);
		this.displayName = data.DisplayName;
		switch (data.UserGender) {
			case "FEMALE":
				this.gender = Gender.FEMALE;
				break;
			case "MALE":
				this.gender = Gender.MALE;
				break;
			default:
				this.gender = Gender.OTHER;
				break;
		}
	}
}

/** Хранит в себе информацию об практике */
export class Practices {
	/** Уникальный идентификатор медитационной практики */
	public readonly id: string;
	/** Название практики */
	public readonly name: string;
	/** Тип практики */
	public readonly type: PracticesMeditation;
	/** Ссылка на фоновое изображение практики */
	public readonly image: string;
	/** Описание практики */
	public readonly description: string;
	/** Ссылка на главный аудио трек */
	public readonly audio?: string;
	/** Требуется ли подписка для прослушивания данной медитации */
	public readonly isNeedSubscribe?: boolean;
	/** Инструкция к данной медитации */
	public readonly instruction: Instruction;

	constructor(data: ServerEntities.Meditation) {
		if (data.TypeMeditation === "set") {
			throw new Error(`Meditation ${data.id} is not practice`);
		}
		if (data.Description === undefined) {
			throw new Error(`The practice should have a description`);
		}
		this.id = data.id;
		this.description = data.Description;
		this.image = "https://storage.yandexcloud.net/dmdmeditationimage/meditation/" + data.id;
		this.name = data.Name;
		this.isNeedSubscribe = data.IsSubscribed;
		if (data.HasAudio) {
			this.audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + data.id;
		}
		switch (data.TypeMeditation) {
			case "breathingPractices":
				this.type = PracticesMeditation.BREATHING_PRACTICES;
				this.instruction = instructionForRelaxation; // ! Исправить когда разберемся с инструкциями
				break;
			case "dancePsychotechnics":
				this.type = PracticesMeditation.DANCE_PSYCHOTECHNICS;
				this.instruction = instructionForRelaxation; // ! Исправить когда разберемся с инструкциями
				break;
			case "directionalVisualizations":
				this.type = PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
				this.instruction = instructionForDirectionalVisualization;
				break;
			case "relaxation":
				this.type = PracticesMeditation.RELAXATION;
				this.instruction = instructionForRelaxation;
				break;
			default:
				throw new Error(`Not found ${data.TypeMeditation} in PracticesMeditation`);
		}
	}
	// TODO добавить работу с аудио плеером
}
