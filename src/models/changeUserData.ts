/** @format */

import { State } from "~types";
import * as Validators from "src/validators";
import { Request } from "~api";
interface ChangeUserDataConstructor {
	readonly image?: string;
	readonly displayName?: string;
	readonly birthday?: Date;
	readonly nickname?: string;
	readonly lastSuccessCheckNickname?: [Date, boolean];
}

export default class ChangeUserData {
	/** Обновленное уникальное имя пользователя */
	private nickname?: string;
	/** Новое изображения пользователя в Base64 */
	private image?: string;
	/** Новое отображаемое имя пользователя */
	private displayName?: string;
	/** Обновленная дата рождения пользователя */
	private birthday?: Date;
	/** Когда был проверка вернула успешный результат nickname на валидность */
	private lastSuccessCheckNickname?: [Date, boolean];

	constructor({ birthday, displayName, image, nickname, lastSuccessCheckNickname }: ChangeUserDataConstructor) {
		this.birthday = birthday;
		this.displayName = displayName;
		this.image = image;
		this.nickname = nickname;
		this.lastSuccessCheckNickname = lastSuccessCheckNickname;
	}

	public async setImage(image: string) {
		this.image = image;
		return this;
	}

	public async setDisplayName(displayName: string) {
		this.displayName = displayName;
		return this;
	}

	public async setNickname(nickName: string) {
		this.checkValidateNickname(nickName);
		this.nickname = nickName;
		return this;
	}

	public async setBirthday(birthday: Date) {
		this.birthday = birthday;
		return this;
	}

	public getState(): State.ChangedUserData {
		let lastSuccessCheckNickname: [string, boolean] | undefined;
		if (this.lastSuccessCheckNickname !== undefined) {
			lastSuccessCheckNickname = [this.lastSuccessCheckNickname[0].toISOString(), this.lastSuccessCheckNickname[1]];
		}
		console.log("getState", lastSuccessCheckNickname);
		return {
			birthday: this.birthday?.toISOString(),
			displayName: this.displayName,
			image: this.image,
			nickname: this.nickname,
			lastSuccessCheckNickname: lastSuccessCheckNickname,
		};
	}

	public static createByState(state: State.ChangedUserData): ChangeUserData {
		let lastSuccessCheckNickname: [Date, boolean] | undefined;
		if (state.lastSuccessCheckNickname !== undefined) {
			lastSuccessCheckNickname = [new Date(state.lastSuccessCheckNickname[0]), state.lastSuccessCheckNickname[1]];
		}
		return new ChangeUserData({
			birthday: state.birthday ? new Date(state.birthday) : undefined,
			displayName: state.displayName,
			image: state.image,
			nickname: state.nickname,
			lastSuccessCheckNickname: lastSuccessCheckNickname,
		});
	}

	public reBuild(): ChangeUserData {
		return ChangeUserData.createByState(this.getState());
	}

	public async checkValidateNickname(nickname?: string): Promise<boolean> {
		if (nickname === undefined) {
			nickname = this.nickname;
		}
		if (nickname === undefined) {
			throw new Error("Nickname not found");
		}
		if (Validators.isNicknameValidate(nickname) && (await Request.getUserByNickname(nickname)) === null) {
			this.lastSuccessCheckNickname = [new Date(), true];
			return true;
		}
		this.lastSuccessCheckNickname = [new Date(), false];
		return false;
	}

	public async getChangeData(checkValidateNickname: boolean = true) {
		let resultCheckValidateNickname: boolean = checkValidateNickname;
		if (checkValidateNickname) {
			if (
				this.lastSuccessCheckNickname === undefined ||
				(this.lastSuccessCheckNickname[0] && getDeltaTime(5) < this.lastSuccessCheckNickname[0])
			) {
				resultCheckValidateNickname = await this.checkValidateNickname();
			} else {
				resultCheckValidateNickname = true;
			}
		}

		return {
			nickname: resultCheckValidateNickname ? this.nickname : undefined,
			image: this.image,
			displayName: this.displayName,
			birthday: this.birthday,
		};
	}

	public async reservationNickname() {
		if (this.nickname !== undefined) await Request.reservationNickname(this.nickname);
	}
}
function getDeltaTime(minute: number): Date {
	const now = new Date();
	now.setDate(now.getMinutes() - minute);
	return now;
}
