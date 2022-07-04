import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  URL_API,
  URL_IMAGE,
  getHeader,
  getToken,
  ApiError,
  HOST_URL,
  MethodSendingData,
} from "./config";

export default class User {
  protected readonly uid: string;
  public nickName: string;
  public birthday: Date;
  public imageId?: string;
  public displayName: string;
  public status: string;
  public role: UserRole;
  public gender: UserGender;
  public category?: UserCategory;

  constructor(userData: UserData) {
    this.uid = userData.uid;
    this.nickName = userData.nickName;
    this.displayName = userData.displayName ?? "";
    this.imageId = userData.image;
    this.status = userData.status ?? "";
    this.birthday = new Date(Date.parse(userData.birthday));
    this.role = userData.role;
    this.gender = userData.gender;
    this.category = userData.category;
  }

  public get image(): string {
    if (this.imageId != null) {
      return `${URL_IMAGE.toString()}/user/${this.imageId}`;
    }
    return `https://firebasestorage.googleapis.com/v0/b/plants-336217.appspot.com/o/avatars%2FGroup%20638.png?alt=media&token=130ffa3d-5672-447c-b156-222382e612bf`;
  }
}

export class UserAccount extends User {
  public mood?: UserMood;
  private subscribes: { [key: string]: subscribe } = {};
  constructor(userData: UserData) {
    super(userData);
    UserAccount.getMood().then((mood) => {
      if (mood) {
        this.editMood(mood);
      }
    });
  }

  public on(name: ActionName, callback: (data: UserMood | undefined) => void) {
    const index = Math.random().toString();
    this.subscribes[index] = { name, callback };
    callback(this.mood);

    return () => {
      delete this.subscribes[index];
    };
  }

  public editMood(mood: UserMood, saveInMemory: boolean = false) {
    this.mood = mood;
    if (saveInMemory) {
      UserAccount.saveMood(mood);
    }
    for (let key of Object.keys(this.subscribes)) {
      if (this.subscribes[key].name == "editMood") {
        this.subscribes[key].callback(this.mood);
      }
    }
  }

  private static asyncStorageKey_MentalState = "@UserMentalState";

  public static async saveMood(parameters: UserMood) {
    const state = { data: parameters, dateSave: new Date().toISOString() };
    AsyncStorage.setItem(
      this.asyncStorageKey_MentalState,
      JSON.stringify(state)
    );
  }

  public static async getMood(): Promise<UserMood | undefined> {
    const item = await AsyncStorage.getItem(this.asyncStorageKey_MentalState);
    if (item == null) {
      return undefined;
    } else {
      const result = JSON.parse(item);
      const { mood, dateSave } = {
        mood: result.data,
        dateSave: Date.parse(result.dateSave) + 12 * 3600 * 1000,
      };
      if (Date.now() > dateSave) {
        return undefined;
      } else {
        return mood;
      }
    }
  }

  public static async checkNickname(
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

  public static async registrationUser(userData: {
    nickname: string;
    birthday: Date;
    image?: string;
    displayName: string;
  }): Promise<UserAccount> {
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
        return new UserAccount(json.result as UserData);
      } else {
        throw new Error(`API ERROR. CODE: ${request.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Function Error`);
    }
  }

  public static async authentication(): Promise<UserAccount | null> {
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
        let user: UserAccount | null = null;
        if (result.user_data != null) {
          user = new UserAccount(result.user_data as UserData);
        }
        return user;
      } else {
        throw new Error(`API ERROR. CODE: ${request.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Function Error`);
    }
  }

  public static async getUserData(uid?: string) {
    try {
      const url = new URL(uid ? `/users/${uid}` : `/users`, URL_API);
      const headers = await getHeader();
      const request = await fetch(url, {
        method: "GET",
        headers,
      });
      if (request.ok) {
        const json = await request.json();
        // return new UserModel(json.result as UserData);
      } else {
        throw new Error(`API ERROR. CODE: ${request.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Function Error`);
    }
  }
}

export enum UserRole {
  NO_REGISTRATION,
  USER,
  ADMIN,
}

export enum UserCategory {
  BLOGGER,
  COMMUNITY,
  ORGANIZATION,
  EDITOR,
  WRITER,
  GARDENER,
  FLOWER_MAN,
  PHOTOGRAPHER,
}

export enum UserGender {
  MALE,
  FEMALE,
  OTHER,
}

export interface UserData {
  uid: string;
  nickName: string;
  birthday: string;
  image?: string;
  displayName?: string;
  status?: string;
  role: number;
  gender: number;
  category: number;
}

export enum UserMood {
  IRRITATION,
  ANXIETY,
  CONCENTRATION,
  HAPPINESS,
}

type ActionName = "editMood";
type subscribe = { name: ActionName; callback: (data: any) => void };

type ReturnCheckNickname = {
  checking_unique_nick_name: boolean;
  nickname_variable?: string[];
};

export enum AuthenticationStatus {
  NONE,
  NO_AUTHORIZED,
  AUTHORIZED,
}
