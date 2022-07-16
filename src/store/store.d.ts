declare interface MeditationState {
  parametersMeditation?: ParametersMeditation;
  parametersMeditationStatus?: ParametersMeditationStatus;
  weekStatistic: WeekStatistic;
  meditationPopularToDay?: MeditationData;
  meditationRecommendToDay?: MeditationData;
  meditationCurrentPlayId?: string;
  favoriteMeditationId: string[];
}
declare interface AccountState {
  mood?: UserMood;
  user?: UserData;
}

declare type ParametersMeditationStatus = "exist" | "not exist";
