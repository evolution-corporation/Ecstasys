import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_API, getHeader, URL_IMAGE, AsyncStorageKey } from "./config";

export async function getMeditationData(
  id: string,
  params: ParamsGetMeditation = { isMinimal: true }
): Promise<MeditationData> {
  try {
    let urlParams = id != undefined ? `/${id}` : "";
    if (Object.keys(params).length != 0) {
      urlParams += "?";
    } else {
      if (params.isMinimal) {
        urlParams += "&isMinimal=true";
      }
    }
    // if (params.popularToDay) {
    //   urlParams += "&popularToDay=true";
    // }
    // if (!!params.recommendToDay) {
    //   urlParams += `&params=${JSON.stringify(
    //     this.translateParamsForServer(params.recommendToDay)
    //   )}`;
    // }
    // if (params.isNotListened && !params.recommendToDay) {
    //   urlParams += "&params=true";
    // }
    const url = new URL(`meditation${urlParams}`, URL_API);

    const headers = await getHeader({ token: true });
    const request = await fetch(url, {
      method: "GET",
      headers,
    });
    if (request.ok) {
      const json = await request.json();
      const result = json.result;
      return createMeditationData(result);
    }
    throw new Error(`API ERROR. CODE: ${request.status}`);
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function getRecommendToDay(
  params?: ParametersMeditation
): Promise<MeditationData | null> {
  try {
    let urlParams = "?";
    if (!!params) {
      urlParams += `&params=${JSON.stringify(params ?? true)}`;
    } else {
      urlParams += `&isNotListened=true`;
    }
    const url = new URL(`meditation${urlParams}`, URL_API);
    const headers = await getHeader({ token: true });
    const request = await fetch(url, {
      method: "GET",
      headers,
    });
    if (request.ok) {
      const json = await request.json();
      const result = json.result;
      return json.result ? createMeditationData(result) : null;
    }
    throw new Error(`API ERROR. CODE: ${request.status}`);
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

// export async function getPopularDay(): Promise<MeditationData> {
//   try {
//     const url = new URL(`meditation?isMinimal=true&popularToDay=true`, URL_API);
//     const headers = await getHeader({ token: true });
//     const request = await fetch(url, {
//       method: "GET",
//       headers,
//     });
//     if (request.ok) {
//       const json = await request.json();
//       const result = json.result;
//       return createMeditationData(result);
//     }
//     throw new Error(`API ERROR. CODE: ${request.status}`);
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Function Error`);
//   }
// }

export async function getMeditationToDay(
  params?: ParametersMeditation
): Promise<{
  popularToDay: MeditationData;
  meditationRecommend: MeditationData | null;
}> {
  try {
    let urlParams = `isMinimal=true&popularToDay=true`;
    if (!!params) {
      urlParams += `&params=${JSON.stringify(params ?? true)}`;
    } else {
      urlParams += `&getIsNotListened=true`;
    }
    const url = new URL(`meditation?${urlParams}`, URL_API);
    const headers = await getHeader({ token: true });
    const request = await fetch(url, {
      method: "GET",
      headers,
    });
    if (request.ok) {
      const json = await request.json();
      const result = json.result;
      return {
        popularToDay: createMeditationData(result.popularToDay),
        meditationRecommend: result.recommend
          ? createMeditationData(result.recommend)
          : null,
      };
    }
    throw new Error(`API ERROR. CODE: ${request.status}`);
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function setParametersMeditation(
  parameters: ParametersMeditation
) {
  AsyncStorage.setItem(
    AsyncStorageKey.ParamsMeditation,
    JSON.stringify(parameters)
  );
}

export async function getParametersMeditation(): Promise<
  [ParametersMeditationStatus, ParametersMeditation | undefined]
> {
  const item = await AsyncStorage.getItem(AsyncStorageKey.ParamsMeditation);
  if (item == null) {
    return ["not exist", undefined];
  } else {
    const data = JSON.parse(item) as ParametersMeditation;
    return ["exist", data];
  }
}

export async function removeParametersMeditation() {
  AsyncStorage.removeItem(AsyncStorageKey.ParamsMeditation);
}

export async function getWeekStatistic(): Promise<WeekStatistic> {
  const item = await AsyncStorage.getItem(AsyncStorageKey.WeekStatistic);
  if (item == null) {
    return {
      count: 0,
      time: 0,
    };
  } else {
    const data = JSON.parse(item);
    const startWeek = new Date();
    startWeek.setDate(startWeek.getDate() - startWeek.getDay());
    startWeek.setHours(0, 0, 0, 0);
    if (new Date(Date.parse(data.dateUpdate)) < startWeek) {
      return { count: data.count, time: data.time };
    } else {
      setWeekStatistic({ count: 0, time: 0 });
      return { count: 0, time: 0 };
    }
  }
}

export async function setWeekStatistic(data: { count: number; time: number }) {
  const toDay = new Date();
  toDay.setHours(0, 0, 0, 0);
  AsyncStorage.setItem(
    AsyncStorageKey.WeekStatistic,
    JSON.stringify({ ...data, dateUpdate: toDay.toISOString() })
  );
}

interface ParamsGetMeditation {
  isMinimal?: boolean;
}

export function createMeditationData(data: MeditationData): MeditationData {
  let model: MeditationData = {
    ...data,
    imageId: data.image,
    get image() {
      return new URL(
        this.imageId,
        `${URL_IMAGE.toString()}/meditation`
      ).toString();
    },
  };
  if (data.audio) {
    model = {
      ...model,
      audioId: data.audio,
      get audio() {
        return new URL(
          this.id,
          `${URL_API.toString()}/meditation.play`
        ).toString();
      },
    };
  }
  return model;
}

export async function getAudioData(
  meditation: MeditationData
): Promise<{ uri: string; headers: { [fieldName: string]: string } }> {
  if (meditation.audio) {
    return {
      uri: meditation.audio,
      headers: (await getHeader()).map,
    };
  }
  throw new Error("audioId Not Found");
}
