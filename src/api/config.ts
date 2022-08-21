import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import NetInfo from "@react-native-community/netinfo";
import i18n from "~i18n";
import { LoadingStatus } from "~constants";

export const HOST_URL = new URL("http://62.84.125.238:8000");
export const URL_API = HOST_URL; //new URL("api", HOST_URL);
export const URL_IMAGE = new URL("image", HOST_URL);
export type ApiError = { codeError: number; name: string };

export async function getToken(): Promise<string> {
  const user = auth().currentUser;
  if (user == null) throw new Error("User not found");
  return await user.getIdToken();
}

export type MethodSendingData = "json" | "form-data";

export async function getHeader(options?: {
  json?: boolean;
  token?: boolean;
}): Promise<Headers> {
  const header = new Headers();
  header.set("appName", "Ecstasys");
  header.set("Accept-Language", i18n.language ?? "ru");
  if (options?.token ?? true) {
    header.set("authorization", await getToken());
  }
  if (options?.json ?? true) {
    header.set("Content-Type", "application/json");
  }
  return header;
}

export const enum AsyncStorageKey {
  MentalState = "@UserMentalState",
  ParamsMeditation = "@MeditationParameters",
  WeekStatistic = "@MeditationWeekStatistic",
  FavoriteMeditations = "@FavoriteMeditations",
  MonthStatistic = "@MeditationMonthStatistic",
  AllTimeStatistic = "@MeditationAllTimeStatistic",
  AccountData = "@AccountData",
  LazyUserData = "@LazyUserData",
}

export function serverRequest(request: Function) {
  try {
    request();
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export function removeUserData() {
  AsyncStorage.multiRemove([
    AsyncStorageKey.MentalState,
    AsyncStorageKey.ParamsMeditation,
    AsyncStorageKey.WeekStatistic,
  ]);
}

export async function checkServerAccess(
  forceCheckConnect: boolean = false
): Promise<boolean> {
  if (forceCheckConnect) {
    const netInformation = await NetInfo.fetch();
    if (!(netInformation.isConnected ?? false)) {
      return false;
    }
  }
  const testUrl = new URL("api/204", URL_API);
  try {
    const request = await fetch(testUrl.toString());
    return request.ok;
  } catch (error) {
    return false;
  }
}
