import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeSubscribe } from "./types";

export async function getSubscribe(): Promise<
  [Date | null, TypeSubscribe, boolean]
> {
  const result = {
    date: await AsyncStorage.getItem("@SubscribeInformation"),
    type: await AsyncStorage.getItem("@SubscribeInformationType"),
    autoPayment: await AsyncStorage.getItem("@SubscribeInformationTypeAuto"),
  };
  if (result.date === null || result.type === null) {
    return [null, null, false];
  }
  const date = JSON.parse(result.date);
  return [
    date ? new Date(date) : null,
    result.type as TypeSubscribe,
    result.autoPayment ? JSON.parse(result.autoPayment) : false,
  ];
}

export async function setSubscribe(
  date: Date,
  type: typeSubscribe,
  autoPayment: boolean
) {
  await AsyncStorage.multiSet([
    ["@SubscribeInformation", JSON.stringify(date)],
    ["@SubscribeInformationType", type ?? JSON.stringify(null)],
    ["@SubscribeInformationTypeAuto", JSON.stringify(autoPayment)],
  ]);
}
