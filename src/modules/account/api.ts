import auth from "@react-native-firebase/auth";
import { isDevice, productName } from "expo-device";
import { Platform } from "react-native";
import { headers } from "~api";
import { getApiOff, customUserData } from "~core";

import { ConverterUserDataToApplication, serverUrl } from "./tools";
import { UpdateUserData } from "./types";

const isEmulator =
  true || (Platform.OS === "android" && !!productName?.includes("emu"));

export async function registration(
  nickname: string,
  birthday: Date,
  image?: string
) {
  if ((await getApiOff()) && (await customUserData.getIsCustomDataUser())) {
    return await customUserData.createCustomerDatatUser(
      nickname,
      birthday,
      image
    );
  } else {
    const request = await fetch(serverUrl.usersURL, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({
        NickName: nickname,
        Birthday: birthday.toISOString(),
        Photo: image,
        expoToken: "test token",
      }),
    });
    if (request.ok) {
      const json = await request.json();
      return ConverterUserDataToApplication(json);
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  }
}

export async function authentication() {
  const user = auth().currentUser;
  if (!user) {
    throw new Error(`User not found`);
  }
  const uid = user.uid;
  if (await getApiOff()) {
    return await customUserData.getDevUserData();
  } else {
    const request = await fetch(`${serverUrl.usersURL}?id=${uid}`, {
      method: "GET",
      headers: await headers(),
    });
    if (request.status === 404) {
      return null;
    }
    if (request.ok) {
      const json = await request.json();
      return ConverterUserDataToApplication(json);
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  }
}

export async function update(data: UpdateUserData) {
  if (await getApiOff()) {
    return await customUserData.setCustomDataUser(data);
  } else {
    const request = await fetch(serverUrl.usersURL, {
      method: "PATCH",
      headers: await headers(),
      body: JSON.stringify({
        Photo: data.image,
        Birthday: data.birthday,
        NickName: data.nickName,
        DisplayName: data.display_name,
      }),
    });
    if (request.ok) {
      const json = await request.json();
      return ConverterUserDataToApplication(json.result);
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  }
}

export async function checkNickname(nickname: string): Promise<boolean> {
  if (await getApiOff()) {
    return nickname !== "bad.nick";
  } else {
    try {
      const url = `${serverUrl.nickname}?nickname=${nickname}`;
      const request = await fetch(url);
      if (request.status == 404) {
        return true;
      }
      if (request.ok) {
        return false;
      } else {
        throw new Error(`API ERROR. CODE: ${request.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Function Error`);
    }
  }
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
