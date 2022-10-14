/** @format */
// * Импорт node_modules
import auth from "@react-native-firebase/auth";

// * Импорт по alias
import { AccountStatus, State } from "~types";
import { Request } from "~api";

// * Импорт рядом лежащих файлов
import Users from "./users";
import ChangeUserData from "./changeUserData";

/** Класс управление аккаунтом в приложении */
export default class Account {
	public userData?: Users;
	public changeUserData: ChangeUserData;

	public get status(): AccountStatus {
		const firebaseUser = auth().currentUser;
		if (firebaseUser === null) {
			return AccountStatus.NO_AUTHENTICATION;
		}
		if (this.userData === undefined) {
			return AccountStatus.NO_REGISTRATION;
		}
		return AccountStatus.REGISTRATION;
	}

	protected get uid() {
		const userFirebase = auth().currentUser;
		if (userFirebase === null) {
			return undefined;
		} else {
			return userFirebase.uid;
		}
	}

	constructor(userData?: Users, changeUserData: ChangeUserData = new ChangeUserData({})) {
		if (userData !== null) {
			this.userData = userData;
		}
		this.changeUserData = changeUserData;
	}
	/** состояние аккаунта */
	public getState(): State.Account {
		let status: State.AccountStatus;
		switch (this.status) {
			case AccountStatus.NO_AUTHENTICATION:
				status = "NO_AUTHENTICATION";
				break;
			case AccountStatus.NO_REGISTRATION:
				status = "NO_REGISTRATION";
				break;
			case AccountStatus.REGISTRATION:
				status = "REGISTRATION";
				break;
		}
		return {
			uid: this.uid,
			status: status,
			userData: this.userData?.getState(),
			changeUserData: this.changeUserData.getState(),
		};
	}
	/** создать аккаунт из состояния */
	public static createByState(state: State.Account): Account {
		let user: Users | undefined;
		if (state.userData) {
			user = Users.createByState(state.userData);
		}
		return new Account(user, ChangeUserData.createByState(state.changeUserData));
	}

	/** Пересборка аккаунта */
	public reBuild(): Account {
		return Account.createByState(this.getState());
	}

	/**
	 * Получить и запомнить информацию об текущем авторизированном пользователе, если вызвать когда пользователь не авторизован выдаст ошибку
	 * @throws AuthorizationUerWasNotFound возвращается если функция была вызвана когда пользователь не найден
	 */
	async authentication(): Promise<Account> {
		if (this.uid === undefined)
			throw new Error(
				"An authorized user was not found. Check the user's authorization status in React Native Firebase"
			);
		const userData = await Users.getById(this.uid);
		if (userData === null) {
			this.userData = undefined;
		} else {
			this.userData = userData;
		}
		return this;
	}

	/**
	 * Регистрирует пользователя в системе Evolution
	 * @param nickname уникальное имя пользователя которое ввел пользователь
	 * @param birthday дата рождения выбранная пользователем
	 * @param image изображение которое выбрал пользователь
	 */
	async registration(nickname: string, birthday: Date, image?: string): Promise<Account> {
		const userData = await Request.createUser({ birthday, nickname, image });
		this.userData = Users.createByServerEntity(userData);
		return this;
	}

	/**
	 * Обновляет данные пользователя в системе Evolution. Сначала берет данные из ChangeUserData, а затем из параметров функции
	 * @param nickname новый никнейм пользователя
	 * @param birthday обновленная дата рождения пользователя
	 * @param image новое изображение пользователя
	 * @param displayName новое отображаемое имя пользователя
	 */
	public async update(nickname?: string, birthday?: Date, image?: string, displayName?: string): Promise<Account> {
		const changeUserData = {
			...(await this.changeUserData.getChangeData()),
			nickname,
			birthday,
			image,
			displayName,
		};
		return await this.updateForce(
			changeUserData.nickname,
			changeUserData.birthday,
			changeUserData.image,
			changeUserData.image
		);
	}

	/**
	 * Обновляет данные пользователя в системе Evolution
	 * @param nickname новый никнейм пользователя
	 * @param birthday обновленная дата рождения пользователя
	 * @param image новое изображение пользователя
	 * @param displayName новое отображаемое имя пользователя
	 */
	public async updateForce(nickname?: string, birthday?: Date, image?: string, displayName?: string): Promise<Account> {
		const userData = await Request.updateUser({
			nickname,
			birthday,
			image,
			displayName,
		});
		this.userData = Users.createByServerEntity(userData);
		return this;
	}

	public async signOut() {
		if (this.uid !== undefined) {
			auth().signOut;
			this.userData = undefined;
			this.changeUserData = new ChangeUserData({});
		}
		return this;
	}

	public async initialization() {
		if (this.uid !== undefined) {
			return await this.authentication();
		} else {
			return await this.signOut();
		}
	}
}
