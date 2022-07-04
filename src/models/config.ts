import * as auth_1 from "firebase/auth";
import app from "~firebase";
import i18n from "~i18n";

export const HOST_URL = new URL("http://192.168.1.146:5000");
export const URL_API = new URL("api", HOST_URL);
export const URL_IMAGE = new URL("image", HOST_URL);
export type ApiError = { codeError: number; name: string };

const auth = auth_1.getAuth(app);

export async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (user == null) throw new Error("User not found");
  return await auth_1.getIdToken(user);
}

export type MethodSendingData = "json" | "form-data";

export async function getHeader(options?: {
  json?: boolean;
  token?: boolean;
}): Promise<Headers> {
  const header = new Headers();
  header.set("app", "ecstasys");
  header.set("Accept-Language", i18n.language ?? "ru");
  if (options?.token ?? true) {
    header.set("authorization", await getToken());
  }
  if (options?.json ?? true) {
    header.set("Content-Type", "application/json");
  }
  return header;
}
