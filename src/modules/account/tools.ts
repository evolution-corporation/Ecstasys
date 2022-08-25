import { HOST_URL } from "~api";

import { UserDataApplication, UserDataServer } from "./types";

export const serverUrl = {
  usersURL: `${HOST_URL}Users`,
  userImageURL: `${HOST_URL}user.image`,
};

export const memoryKey = {
  account: "@Account",
  lazyAccount: "@LazyAccount",
};

export function ConverterUserDataToApplication(
  data: UserDataServer,
  imageType: "base64" | "URL" = "URL"
): UserDataApplication {
  let name: string | undefined;
  let surname: string | undefined;
  let image: string = `https://firebasestorage.googleapis.com/v0/b/plants-336217.appspot.com/o/avatars%2FGroup%20638.png?alt=media&token=130ffa3d-5672-447c-b156-222382e612bf`;
  if (data.Display_name) {
    let { name, surname } = converterDisplayNameToNameSurname(
      data.Display_name
    );
  }
  if (data.Image) {
    if (imageType === "URL") {
      image = `${serverUrl.userImageURL}/${data.Uid}`;
    } else {
      image = data.Image;
    }
  }
  return {
    uid: data.Uid,
    name: name,
    surname: surname,
    image: image,
    birthday: data.Birthday,
    nickName: data.NickName,
    subscribeInfo: undefined,
  };
}

export function converterDisplayNameToNameSurname(displayNme: string) {
  displayNme = displayNme.replaceAll(" ", "_");
  let name: string = displayNme.split("_")[0];
  let surname: string | undefined;
  if (displayNme.includes("_")) {
    surname = displayNme.split("_")[1];
  }
  return { name, surname: surname };
}

export function converterNameSurnameToDisplayName(
  name?: string,
  surname?: string
) {
  name = name?.replaceAll(" ", "");
  surname = surname?.replaceAll(" ", "");
  let displayName = name;
  if (surname) {
    displayName += `_${surname}`;
  }
  return displayName;
}
