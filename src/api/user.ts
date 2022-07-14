import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_API, URL_IMAGE, getHeader, AsyncStorageKey } from "./config";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export async function checkNickname(
  nickName: string,
  generate?: boolean
): Promise<ReturnCheckNickname> {
  try {
    const url = new URL(`/nickName/${nickName}`, URL_API);
    const header = new Headers();
    header.append("app", "ecstasys");

    const params = {
      generate_nickname: String(generate ?? false),
    };
    const request = await fetch(
      `${url}?${Object.entries(params)
        .map(([name, value]) => `${name}=${value}`)
        .join("&")}`,
      {
        method: "GET",
        headers: header,
      }
    );
    if (request.ok) {
      const json = await request.json();
      return json.result as ReturnCheckNickname;
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function getUserData(uid?: string) {
  try {
    const url = new URL(uid ? `/users/${uid}` : `/users`, URL_API);
    const headers = await getHeader();
    const request = await fetch(url, {
      method: "GET",
      headers,
    });
    if (request.ok) {
      const json = await request.json();
      return createUserData(json.result as UserData);
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function authentication() {
  try {
    const url = new URL(`/authentication`, URL_API);
    const headers = await getHeader();
    const request = await fetch(url, {
      method: "GET",
      headers,
    });
    if (request.ok) {
      const json = await request.json();
      const result = json.result;

      return !!result.user_data
        ? createUserData(result.user_data as UserData)
        : null;
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function registration(userData: UserMinimalData) {
  try {
    const url = new URL(`/users`, URL_API);
    const headers = await getHeader();
    let body: string = JSON.stringify(userData);
    const request = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    if (request.ok) {
      const json = await request.json();
      return createUserData(json.result as UserData);
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function getMood(): Promise<UserMood | undefined> {
  const item = await AsyncStorage.getItem(AsyncStorageKey.MentalState);
  if (item == null) {
    return undefined;
  } else {
    const result = JSON.parse(item);
    const { mood, dateSave } = {
      mood: result.data,
      dateSave: Date.parse(result.dateSave) + 12 * 3600 * 1000,
    };
    if (Date.now() > dateSave) {
      deleteMood();
      return undefined;
    } else {
      return mood;
    }
  }
}

export async function setMood(mood: UserMood) {
  AsyncStorage.setItem(
    AsyncStorageKey.MentalState,
    JSON.stringify({
      data: mood,
      dateSave: new Date().toISOString(),
    })
  );
}

export async function deleteMood() {
  AsyncStorage.removeItem(AsyncStorageKey.MentalState);
}

type ReturnCheckNickname = {
  checking_unique_nick_name: boolean;
  nickname_variable?: string[];
};

export function createUserData(data: UserData): UserData {
  return {
    ...data,
    imageId: data.image,
    get image() {
      if (this.imageId != null) {
        return `${URL_IMAGE.toString()}/user/${this.imageId}`;
      }
      return `https://firebasestorage.googleapis.com/v0/b/plants-336217.appspot.com/o/avatars%2FGroup%20638.png?alt=media&token=130ffa3d-5672-447c-b156-222382e612bf`;
    },
  };
}

export async function requestSMSCode(
  numberPhone: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return await auth().signInWithPhoneNumber(numberPhone);
}

export async function checkSMSCode(
  code: string,
  confirm: FirebaseAuthTypes.ConfirmationResult
) {
  await confirm.confirm(code);
}
