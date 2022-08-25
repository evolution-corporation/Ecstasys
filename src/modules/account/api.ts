import auth from "@react-native-firebase/auth";
import { isDevice, productName } from "expo-device";
import { getExpoPushTokenAsync } from "expo-notifications";
import { Platform } from "react-native";
import { headers } from "~api";

import {
  converterNameSurnameToDisplayName,
  ConverterUserDataToApplication,
  serverUrl,
} from "./tools";
import { UpdateUserData } from "./types";

const isEmulator = Platform.OS === "android" && !!productName?.includes("emu");

export async function registration(
  nickname: string,
  birthday: Date,
  image?: string
) {
  console.log(isEmulator);
  const request = await fetch(serverUrl.usersURL, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify({
      NickName: nickname,
      birthday: birthday.toISOString(),
      Image: image,
      ExpoToken: isEmulator
        ? (
            await getExpoPushTokenAsync()
          ).data
        : "test Token",
    }),
  });
  if (request.ok) {
    const json = await request.json();
    return ConverterUserDataToApplication(json.result);
  } else {
    throw new Error(`API ERROR. CODE: ${request.status}`);
  }
}

export async function authentication() {
  const user = auth().currentUser;
  if (!user) {
    throw new Error(`User not found`);
  }
  const uid = user.uid;
  const request = await fetch(`${serverUrl.usersURL}/${uid}`, {
    method: "GET",
    headers: await headers(),
  });
  if (request.status === 404) {
    return null;
  }
  if (request.ok) {
    const json = await request.json();
    return ConverterUserDataToApplication(json.result);
  } else {
    throw new Error(`API ERROR. CODE: ${request.status}`);
  }
}

export async function update(data: UpdateUserData) {
  const request = await fetch(serverUrl.usersURL, {
    method: "UPDATE",
    headers: await headers(),
    body: JSON.stringify({
      Image: data.image,
      Birthday: data.birthday,
      Nickname: data.nickName,
      Display_name: converterNameSurnameToDisplayName(data.name, data.surname),
    }),
  });
  if (request.ok) {
    const json = await request.json();
    return ConverterUserDataToApplication(json.result);
  } else {
    throw new Error(`API ERROR. CODE: ${request.status}`);
  }
}
