import { headers } from "~api";

import { getApiOff, subscribe } from "~core";
import { Subscribe } from "./types";

export async function getSubscribeInformation(): Promise<Subscribe | null> {
  if (await getApiOff()) {
    const [dateNextPayment, type, autoPayment] = await subscribe.getSubscribe();
    return dateNextPayment ? { dateNextPayment, type, autoPayment } : null;
  }
  return null;
}
