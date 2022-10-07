import auth from "@react-native-firebase/auth";
import { AccountJSON, ServerEntities } from "~types";

import { getNickname, getUserById, patchUser, postUser } from "./requests";

const accountAdaptation = (data: ServerEntities.User): AccountJSON => ({
  uid: data.Id,
  birthday: data.Birthday,
  nickName: data.NickName,
  displayName: data.DisplayName,
  image: data.HasPhoto
    ? `https://storage.yandexcloud.net/dmdmeditationimage/users/${data.Id}`
    : "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png",
});

export async function registration(
  nickname: string,
  birthday: Date,
  image?: string
): Promise<AccountJSON> {
  return accountAdaptation(
    await postUser({
      Birthday: birthday.toUTCString(),
      NickName: nickname,
      Image: image,
    })
  );
}

export async function authentication(): Promise<AccountJSON | null> {
  const user = await auth().currentUser;
  if (user === null) return null;
  const token = await user.getIdToken();
  let userData: ServerEntities.User | null = null;
  userData = await getUserById({ user_id: user.uid });
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

export async function generateNickname(
  nickname: string,
  nicknameList: string[] = [],
  templateNoUsed = [...templateOriginal]
): Promise<string[]> {
  if (nicknameList.length >= 5 || templateNoUsed.length == 0) {
    return nicknameList;
  }
  const variableIndex = Math.floor(Math.random() * templateNoUsed.length);
  const variableNickname = templateNoUsed.splice(variableIndex, 1)[0](nickname);
  if (true) {
    nicknameList.push(variableNickname);
  }
  return await generateNickname(
    nickname,
    [...nicknameList],
    [...templateNoUsed]
  );
}

const templateOriginal: ((nickname: string) => string)[] = [
  (nickname) => `${nickname}_1`,
  (nickname) => `${nickname}_2`,
  (nickname) => `${nickname}_3`,
  (nickname) => `${nickname}_4`,
  (nickname) => `${nickname}_5`,
  (nickname) => `${nickname}_6`,
  (nickname) => `${nickname}_7`,
  (nickname) => `${nickname}_8`,
  (nickname) => `${nickname}_9`,
  (nickname) => `${nickname}_10`,
];
