import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  URL_API,
  URL_IMAGE,
  getHeader,
  AsyncStorageKey,
  checkServerAccess,
} from "./config";
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
  const serverAccess = await checkServerAccess(true);
  if (serverAccess) {
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
        if (result) {
          AsyncStorage.setItem(
            AsyncStorageKey.AccountData,
            JSON.stringify(result)
          );
        }
        return !!result ? createUserData(result as UserData) : null;
      } else {
        throw new Error(`API ERROR. CODE: ${request.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const AccountDataStorage = await AsyncStorage.getItem(
    AsyncStorageKey.AccountData
  );
  if (AccountDataStorage != null) {
    const AccountDataLastUpdate = await AsyncStorage.getItem(
      AsyncStorageKey.LazyUserData
    );
    return createUserData({
      ...JSON.parse(AccountDataStorage),
      ...JSON.parse(AccountDataLastUpdate ?? "{}"),
    });
  }
  throw new Error(`Function Error`);
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

export async function getMood(): Promise<{
  mood: UserMood | undefined;
  score: number[];
  timeStartSave: Date;
}> {
  const item = await AsyncStorage.getItem(AsyncStorageKey.MentalState);
  if (item != null) {
    const result = JSON.parse(item);
    const { mood, dateSave } = {
      mood: result.data,
      dateSave: Date.parse(result.dateSave) + 12 * 3600 * 1000,
    };
    if (Date.now() <= dateSave) {
      return {
        mood: mood,
        score: result.score,
        timeStartSave: new Date(dateSave),
      };
    }
    deleteMood();
  }
  return { mood: undefined, score: [], timeStartSave: new Date() };
}

export async function setMood(mood: UserMood, score: number[]) {
  const { timeStartSave } = await getMood();
  AsyncStorage.setItem(
    AsyncStorageKey.MentalState,
    JSON.stringify({
      data: mood,
      score,
      dateSave:
        Date.now() <= timeStartSave.getDate() + 12 * 3600 * 1000
          ? new Date().toISOString()
          : timeStartSave.toISOString(),
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

export function createUserData(data: {
  uid: string;
  status?: string;
  role: UserRole;
  gender: UserGender;
  category: UserCategory;
  imageId?: string;
  subscribeInfo?: SubscribeInfo;
  nickName: string;
  birthday: string;
  image?: string;
  display_name?: string;
  sub?: string;
}): UserData {
  const [subname, name] = data.display_name
    ?.replaceAll(" ", "_")
    ?.split("_", 2) ?? [undefined, undefined];
  delete data.display_name;

  return {
    ...data,
    name: name,
    subname: subname,
    imageId: data.image,
    get image() {
      if (this.imageId != null) {
        if (data.image && data.image.includes("data:image/base64")) {
          return `data:image/png;base64, ${data.image.replace(
            "data:image/base64,",
            ""
          )}`;
        }
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

export async function lazyUpdateUserData(
  data: DateUserUpdate,
  oldData?: UserData
) {
  const serverAccess = await checkServerAccess(true);
  let display_name: string | undefined;
  if (data.name || data.subname) {
    data.name = data.name ?? oldData?.name;
    data.subname = data.subname ?? oldData?.subname;
    if (data.name == undefined || data.subname == undefined) {
      display_name = data.name ?? data.subname;
    } else {
      display_name = `${data.subname} ${data.name}`;
    }
  }
  if (serverAccess) {
    const url = new URL("/users", URL_API);
    const body: {
      image?: string;
      nickname?: string;
      display_name?: string;
      birthday?: string;
    } = {
      image: data.image,
      display_name: display_name,
      birthday: data.dateBirthday?.toISOString(),
    };
    if (data.dateBirthday) {
      body.birthday = data.dateBirthday.toISOString();
    }
    const request = await fetch(url.toString(), {
      method: "PATCH",
      headers: await getHeader(),
      body: JSON.stringify(body),
    });
    if (request.ok) {
      const result = JSON.parse(await request.json()).result;
      AsyncStorage.removeItem(AsyncStorageKey.LazyUserData);
      return createUserData(result);
    }
  } else {
    const saveLazyUserData = JSON.parse(
      (await AsyncStorage.getItem(AsyncStorageKey.LazyUserData)) ?? "{}"
    );
    const body: {
      display_name?: string;
      birthday?: string;
      image?: string;
    } = {
      display_name: display_name,
      birthday: data.dateBirthday?.toISOString(),
      image: data.image,
    };
    for (let key of Object.keys(body)) {
      if (body[key] != undefined) {
        saveLazyUserData[key] = body[key];
      }
    }
    AsyncStorage.setItem(
      AsyncStorageKey.LazyUserData,
      JSON.stringify(saveLazyUserData)
    );
    const AccountDataStorage = await AsyncStorage.getItem(
      AsyncStorageKey.AccountData
    );
    if (AccountDataStorage == null) {
      throw new Error("Storage no have user data");
    }
    return createUserData({
      ...(JSON.parse(AccountDataStorage) as UserData),
      ...saveLazyUserData,
    });
  }
}

export interface DateUserUpdate {
  image?: string;
  nickname?: string;
  name?: string;
  subname?: string;
  dateBirthday?: Date;
}
