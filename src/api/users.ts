import { RequestError } from "src/Errors";
import { CanSerialization, UserInformation } from "~types";
import Request from "./request";
import { Gender } from "./types";

class User {
	public static getById = async (userId: string, options: { signal?: AbortSignal } = {}) => {
		try {
			const requestServer = await Request.get("users?id=" + userId, options.signal);
			if (requestServer.status === 404) {
				return;
			}
			if (requestServer.status >= 500) {
				throw new RequestError(`getUserById: ${await requestServer.text()}`, "", undefined, "GET", "50x");
			}
			return await requestServer.toUser();
		} catch (error) {
			if (error instanceof Error && error.name == "AbortError") {
			} else {
				throw error;
			}
		}
	};

	public static crete = async (
		{ birthday, nickname, image }: Omit<UserInformation, "id">,
		options: { signal?: AbortSignal } = {}
	) => {
		try {
			const url = URL + "users";
			const requestServer = await Request.post<{
				NickName: string;
				Birthday: string;
				Gender: "MALE" | "FEMALE" | "OTHER";
				Image?: string;
				DisplayName?: string;
			}>(
				"users",
				{
					Birthday: birthday.toISOString(),
					NickName: nickname,
					Image: image,
					Gender: "OTHER",
				},
				options.signal
			);
			if (requestServer.status >= 500) {
				throw new RequestError(
					`createUser: ${await requestServer.text()}`,
					url,
					JSON.stringify({
						NickName: nickname,
						Birthday: birthday.toISOString(),
						Image: image,
					}),
					"POST",
					"50x"
				);
			}
			return await requestServer.toUser();
		} catch (error) {
			if (error instanceof Error && error.name == "AbortError") {
			} else {
				throw error;
			}
		}
	};

	public static update = async (
		{
			birthday,
			displayName,
			image,
			nickname,
			gender,
		}: Omit<Partial<UserInformation>, "id" | "image"> & { image?: string },
		options: { signal?: AbortSignal } = {}
	) => {
		try {
			const body: [string, string][] = [];
			if (nickname !== undefined) body.push(["NickName", nickname]);
			if (displayName !== undefined) body.push(["DisplayName", displayName]);
			if (birthday !== undefined) body.push(["Birthday", birthday.toISOString()]);
			if (image !== undefined) body.push(["Image", image]);
			if (gender !== undefined) body.push(["Gender", gender]);
			const url = URL + "users";
			const requestServer = await Request.patch("users", Object.fromEntries(body), options.signal);
			if (requestServer.status >= 500) {
				throw new RequestError(
					`updateUser: ${await requestServer.text()}`,
					url,
					JSON.stringify(Object.fromEntries(body)),
					"PATCH",
					"50x"
				);
			}
			return await requestServer.toUser();
		} catch (error) {
			if (error instanceof Error && error.name == "AbortError") {
			} else {
				throw error;
			}
		}
	};

	public static getByNickname = async (nickname: string, options: { signal?: AbortSignal } = {}) => {
		try {
			const requestServer = await Request.get("nickname?nickname=" + nickname, options.signal);
			if (requestServer.status === 404) {
				return;
			}
			if (requestServer.status >= 500) {
				throw new RequestError(`getUserByNickname: ${await requestServer.text()}`, "", undefined, "GET", "50x");
			}
			return await requestServer.toUser();
		} catch (error) {
			if (error instanceof Error && error.name == "AbortError") {
			} else {
				throw error;
			}
		}
	};

	public static toUser = (data: UserServerEntities): UserInformation & CanSerialization<UserInformation> => {
		let image = "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";
		if (data.PhotoId) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/" + data.PhotoId + ".png";
		const id = data.Id;
		const birthday = new Date(data.Birthday);
		const displayName = data.DisplayName;
		const gender = Gender[data.Gender];
		const nickname = data.NickName;

		return {
			id,
			birthday,
			displayName,
			image,
			gender,
			nickname,
			toSerialization: () => ({
				id,
				birthday: birthday.toISOString(),
				displayName,
				image: image,
				gender,
				nickname,
			}),
		};
	};
}

Response.prototype.toUser = async function () {
	const data = await this.json();
	if (!data) {
		return;
	}
	return User.toUser(data);
};

declare global {
	interface Response {
		toUser: () => Promise<Readonly<UserInformation & CanSerialization<UserInformation>> | undefined>;
	}
}

export default User;

export interface UserServerEntities {
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
	readonly Role: "ADMIN" | "USER";
	/** Пол пользователя который он указал */
	readonly Gender: "MALE" | "FEMALE" | "OTHER";
	/** Категория к деятельности пользователя, которую он указал */
	readonly Category:
		| "NULL"
		| "BLOGGER"
		| "COMMUNITY"
		| "ORGANIZATION"
		| "EDITOR"
		| "WRITER"
		| "GARDENER"
		| "FLOWER_MAN"
		| "PHOTOGRAPHER";
	/** Дата регистрации пользователя */
	readonly DateTimeRegistration: string;
	/** Есть ли у пользователя изображение профиля */
	readonly PhotoId?: string;
	/** Есть ли у пользователя подписка */
	readonly IsSubscribe: boolean;
}
