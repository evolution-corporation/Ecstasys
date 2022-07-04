import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_API, getHeader, URL_IMAGE } from "./config";

interface MeditationData {
  lengthAudio: number;
  name: string;
  type: TypeMeditation;
  image: string;
  description: string;
}

export default class Meditation {
  public lengthAudio: number;
  public name: string;
  public type: TypeMeditation;
  public description: string;
  private imageId: string;
  constructor(data: MeditationData) {
    this.name = data.name;
    this.lengthAudio = data.lengthAudio;
    this.type = data.type;
    this.imageId = data.image;
    this.description = data.description;
  }

  public get image() {
    return `${URL_IMAGE}/meditation/${this.imageId}`;
  }

  private static meditationDay?: Meditation;
  private static meditationRecommend?: Meditation;

  private static asyncStorageKey = {
    params: "@MeditationParameters",
    weekStatistic: "@MeditationWeekStatistic",
  };

  public static async saveParameters(parameters: ParametersMeditation) {
    AsyncStorage.setItem(
      this.asyncStorageKey.params,
      JSON.stringify(parameters)
    );
  }

  public static async getParameters(): Promise<ParametersMeditation> {
    const item = await AsyncStorage.getItem(this.asyncStorageKey.params);
    if (item == null) {
      return {
        countDay: NumberWeek.EveryOtherDay,
        time: TimeDay.halfHour,
        type: [],
      };
    } else {
      const data = JSON.parse(item) as ParametersMeditation;
      return data;
    }
  }

  private static translateParamsForServer(
    data: ParametersMeditation
  ): ParametersMeditationForServer {
    const countDay =
      data.countDay == NumberWeek.EveryDay
        ? 6
        : data.countDay == NumberWeek.EveryOtherDay
        ? 3
        : 2;
    const time =
      data.time == TimeDay.halfHour ? 20 : data.time == TimeDay.hour ? 60 : 15;
    return {
      countDay,
      time,
      type: data.type.map((item) => TypeMeditation[item]),
    };
  }

  private static async get(
    params: {
      isMinimal?: boolean;
      popularToDay?: boolean;
      recommendToDay?: ParametersMeditation;
      isNotListened?: boolean;
    } = {},
    id?: string
  ): Promise<{ [index: string]: Meditation } | Meditation | undefined> {
    try {
      let urlParams = id != undefined ? `/${id}` : "";
      if (Object.keys(params).length != 0) {
        urlParams += "?";
      } else {
        if (params.isMinimal) {
          urlParams += "&isMinimal=true";
        }
      }
      if (params.popularToDay) {
        urlParams += "&popularToDay=true";
      }
      if (!!params.recommendToDay) {
        urlParams += `&params=${JSON.stringify(
          this.translateParamsForServer(params.recommendToDay)
        )}`;
      }
      if (params.isNotListened && !params.recommendToDay) {
        urlParams += "&params=true";
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
        if (!id) {
          this.meditationRecommend =
            new Meditation(result.recommend) ?? this.meditationRecommend;
          this.meditationDay =
            new Meditation(result.popular) ?? this.meditationDay;
          return Object.fromEntries(
            Object.entries(result).map(([name, params]) => [
              name,
              new Meditation(params as MeditationData),
            ])
          );
        }
        return new Meditation(result);
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public static async getRecommendToDay(): Promise<Meditation | undefined> {
    if (!!this.meditationRecommend) return this.meditationRecommend;
    const result = await this.get({
      recommendToDay: await this.getParameters(),
    });
    if (result instanceof Meditation || result == undefined) return result;
    return result.recommend;
  }

  public static async getPracticalDay(): Promise<Meditation | undefined> {
    if (!!this.meditationDay) return this.meditationDay;
    const result = await this.get({ popularToDay: true });
    if (result instanceof Meditation || result == undefined) return result;
    return result.popular;
  }

  public static async getMeditationToDay(): Promise<{
    meditationDay: Meditation;
    meditationRecommend: Meditation | undefined;
  }> {
    const meditations = await this.get({
      isMinimal: true,
      popularToDay: true,
      recommendToDay: await this.getParameters(),
    });
    if (!(meditations instanceof Meditation) && meditations != undefined)
      return {
        meditationDay: meditations.popular,
        meditationRecommend: meditations.recommend,
      };
    throw new Error("App Error Хз что тут вывести");
  }

  private static subscribes: { [key: string]: subscribe } = {};

  public static on(
    name: ActionName,
    callback: (data: WeekStatistic | undefined) => void
  ) {
    const index = Math.random().toString();
    this.subscribes[index] = { name, callback };
    this.getWeekStatisticMeditation().then((weekStatistic) =>
      callback(weekStatistic)
    );

    return () => {
      delete this.subscribes[index];
    };
  }

  private static _countWeekMeditations?: number;
  private static _timeWeekMeditations?: number;

  public static async getWeekStatisticMeditation(): Promise<WeekStatistic> {
    if (this._countWeekMeditations && this._timeWeekMeditations) {
      return {
        count: this._countWeekMeditations,
        time: this._timeWeekMeditations,
      };
    } else {
      const { count, time } = await this.getStatisticFromMemory();
      this._countWeekMeditations = count;
      this._timeWeekMeditations = time;
      return {
        count: this._countWeekMeditations,
        time: this._timeWeekMeditations,
      };
    }
  }

  private static async getStatisticFromMemory(): Promise<WeekStatistic> {
    const item = await AsyncStorage.getItem(this.asyncStorageKey.weekStatistic);
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
        this.updateStatisticFromMemory({ count: 0, time: 0 });
        return { count: 0, time: 0 };
      }
    }
  }

  private static async updateStatisticFromMemory(data: {
    count: number;
    time: number;
  }) {
    const toDay = new Date();
    toDay.setHours(0, 0, 0, 0);
    AsyncStorage.setItem(
      this.asyncStorageKey.weekStatistic,
      JSON.stringify({ ...data, dateUpdate: toDay.toISOString() })
    );
  }

  public static addWeekStatic(time: number) {
    if (this._countWeekMeditations && this._timeWeekMeditations) {
      this._countWeekMeditations += 1;
      this._timeWeekMeditations += time;
    } else {
      this._countWeekMeditations = 1;
      this._timeWeekMeditations = time;
    }

    this.updateStatisticFromMemory({
      count: this._countWeekMeditations,
      time: this._timeWeekMeditations,
    });
    for (let key of Object.keys(this.subscribes)) {
      if (this.subscribes[key].name == "updateWeekStatic") {
        this.subscribes[key].callback({
          count: this._countWeekMeditations,
          time: this._timeWeekMeditations,
        });
      }
    }
  }
}

export interface WeekStatistic {
  count: number;
  time: number;
}

interface ParametersMeditationForServer {
  countDay: number;
  time: number;
  type: string[];
}

export interface ParametersMeditation {
  countDay: NumberWeek;
  time: TimeDay;
  type: TypeMeditation[];
}

export enum NumberWeek {
  EveryDay,
  EveryOtherDay,
  ThreeTimesWeek,
}

export enum TimeDay {
  hour,
  halfHour,
  quarterHour,
}

export enum TypeMeditation {
  relaxation,
  breathingPractices,
  directionalVisualizations,
  dancePsychotechnics,
  DMD,
}

type ActionName = "updateWeekStatic";

type subscribe = { name: ActionName; callback: (data: any) => void };
