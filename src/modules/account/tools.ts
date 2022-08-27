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
  let image: string = `https://firebasestorage.googleapis.com/v0/b/plants-336217.appspot.com/o/avatars%2FGroup%20638.png?alt=media&token=130ffa3d-5672-447c-b156-222382e612bf`;

  if (data.hasPhoto) {
    image = `${serverUrl.userImageURL}/${data.id}`;
  }
  return {
    uid: data.id,
    displayName: data.display_name,
    image: image,
    birthday: new Date(data.birthday),
    nickName: data.nickName,
    subscribeInfo: undefined,
  };
}
