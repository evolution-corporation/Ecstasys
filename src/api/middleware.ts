/** @format */

import auth from "@react-native-firebase/auth";
import { AccountJSON, ServerEntities } from "~types";

import { getNickname, getUser, patchUser, postUser, getMeditation } from "./requests";

const accountAdaptation = (data: ServerEntities.User): AccountJSON => ({
	uid: data.Id,
	birthday: data.Birthday,
	nickName: data.NickName,
	displayName: data.DisplayName,
	image: data.HasPhoto
		? `https://storage.yandexcloud.net/dmdmeditationimage/users/${data.Id}`
		: "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png",
});

export async function registration(nickname: string, birthday: Date, image?: string): Promise<AccountJSON> {
	return accountAdaptation(
		await postUser({
			Birthday: birthday.toUTCString(),
			NickName: nickname,
			Image: image,
		})
	);
}

export async function authentication(): Promise<AccountJSON | null> {
	const user = auth().currentUser;
	if (user === null) return null;
	const userData = await getUser({ user_id: user.uid });
	// @ts-ignore
	return userData === null ? null : accountAdaptation(userData);
}

export async function update(
	nickname?: string,
	birthday?: Date,
	image?: string,
	displayName?: string
): Promise<AccountJSON> {
	return accountAdaptation(
		await patchUser({
			Birthday: birthday ? birthday.toUTCString() : undefined,
			NickName: nickname,
			Image: image,
			DisplayName: displayName,
		})
	);
}

export async function checkNickname(nickname: string): Promise<boolean> {
	return !!(await getNickname({ nickname }));
}

export async function getPopularMeditation() {
	return await getMeditation({ popularToday: true, countOfMeditations: 0 });
}
