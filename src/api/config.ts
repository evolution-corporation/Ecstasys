import auth from "@react-native-firebase/auth";
import NetInfo from "@react-native-community/netinfo";

export const HOST_URL = new URL("http://62.84.125.238:8000");
export const url204 = `${HOST_URL}/api/204`;
export async function checkServerAccess(
  forceCheckConnect: boolean = true
): Promise<boolean> {
  if (forceCheckConnect) {
    const netInformation = await NetInfo.fetch();
    if (!(netInformation.isConnected ?? false)) {
      return false;
    }
  }
  try {
    const request = await fetch(url204);
    return request.ok;
  } catch (error) {
    return false;
  }
}
export async function headers() {
  const user = auth().currentUser;
  if (user === null) throw new Error("User not found");
  return {
    appName: "DMD Meditation",
    "Accept-Language": "ru",
    authorization: await user.getIdToken(),
    "Content-Type": "application/json",
  };
}

export async function jsonRequest(
  url: string,
  parameters: string | null = null,
  method: RequestMethod = "GET",
  body?: string
) {
  let _url = `${HOST_URL}/${url}`;
  if (parameters !== null) {
    _url += `?${parameters}`;
  }
  const request = await fetch(_url, {
    method,
    headers: await headers(),
    body,
  });
  const json = await request.json();
  return json.reqsult;
}

type RequestMethod = "GET" | "PUT" | "UPDATE" | "POST" | "DELETE";
