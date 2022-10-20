/**
 * Хранит в себе информацию об пользователе
 *
 * @format
 */

import { State, Gender } from "~types";
import {} from "~api";
import { ServerEntities } from "src/api/types";
import { Request } from "~api";

/**
 * Класс управления пользователем
 */
export default class Users {
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
	public readonly gender: Gender;

	constructor(uid: string, nickName: string, image: string, birthday: Date, gender: Gender, displayName?: string) {
		this.uid = uid;
		this.nickName = nickName;
		this.image = image;
		this.birthday = birthday;
		this.displayName = displayName;
		this.gender = gender;
	}

	/** состояние пользователя */
	public getState(): State.User {
		return {
			uid: this.uid,
			birthday: this.birthday.toISOString(),
			image: this.image,
			nickName: this.nickName,
			gender: this.gender,
			displayName: this.displayName,
		};
	}

	/** создать пользователя из состояния */
	public static createByState(state: State.User): Users {
		let gender: Gender;
		switch (state.gender) {
			case "MALE":
				gender = Gender.MALE;
				break;
			case "FEMALE":
				gender = Gender.FEMALE;
				break;
			default:
				gender = Gender.OTHER;
				break;
		}
		return new Users(state.uid, state.nickName, state.image, new Date(state.birthday), gender, state.displayName);
	}

	/** Пересборка пользователя */
	public reBuild() {
		return Users.createByState(this.getState());
	}

	/** Преобразует возвращаемы сервером данные в модель User
	 * @data data данные которые возвращает сервер
	 */
	public static createByServerEntity(data: ServerEntities.User): Users {
		let image = "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";
		if (data.HasPhoto) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/" + data.Id;
		let gender: Gender;
		switch (data.Gender) {
			case "FEMALE":
				gender = Gender.FEMALE;
				break;
			case "MALE":
				gender = Gender.MALE;
				break;
			default:
				gender = Gender.OTHER;
				break;
		}
		return new Users(data.Id, data.NickName, image, new Date(data.Birthday), gender, data.DisplayName);
	}

	/** Получить данные об пользователе по id
	 * @params userId Идентификатор пользователя Модуль которого необходимо получить
	 */
	public static async getById(userId: string): Promise<Users | null> {
		const userData = await Request.getUserById(userId);
		if (userData === null) {
			return null;
		} else {
			return Users.createByServerEntity(userData);
		}
	}

	//!
	public static async getByNickName(nickname: string): Promise<Users | null> {
		const userData = await Request.getUserByNickname(nickname);
		if (userData === null) {
			return null;
		} else {
			return Users.createByServerEntity(userData);
		}
	}
}
