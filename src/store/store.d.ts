declare interface MeditationState {
  parametersMeditation?: ParametersMeditation;
  parametersMeditationStatus?: ParametersMeditationStatus;
  weekStatistic: WeekStatistic;
  meditationPopularToDay?: MeditationData;
  meditationRecommendToDay?: MeditationData;
  meditationCurrentPlayId?: string;
}
declare interface AccountState {
  mood?: UserMood;
  user?: UserData;
}

declare type ParametersMeditationStatus = "exist" | "not exist";
