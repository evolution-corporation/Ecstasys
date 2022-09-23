import { HOST_URL } from "~api";

import { UserDataApplication, UserDataServer } from "./types";

export const serverUrl = {
  usersURL: `${HOST_URL}Users`,
  userImageURL: `${HOST_URL}user.image`,
  nickname: `${HOST_URL}nickname`,
};

export const memoryKey = {
  account: "@Account",
  lazyAccount: "@LazyAccount",
};

export function ConverterUserDataToApplication(
  data: UserDataServer
): UserDataApplication {
  let image: string =
    "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";

  if (data.hasPhoto) {
    image = `${serverUrl.userImageURL}/${data.id}`;
  }
  return {
    uid: data.id,
    displayName: data.displayName,
    image: image,
    birthday: new Date(data.birthday),
    nickName: data.nickName,
    subscribeInfo: undefined,
  };
}
