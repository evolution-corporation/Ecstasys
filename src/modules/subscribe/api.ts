import { headers } from "~api";

import { getApiOff, subscribe } from "~core";
import { typeSubscribe } from "./types";

export async function getSubscribeInformatio(): Promise<{
  nextPayment: Date;
  type: typeSubscribe;
  auto: boolean;
} | null> {
  if (await getApiOff()) {
    const [dateNextPayment, type, autoPayment] = await subscribe.getSubscribe();
    return dateNextPayment
      ? { nextPayment: dateNextPayment, type, auto: autoPayment }
      : null;
  }
  return null;
}
