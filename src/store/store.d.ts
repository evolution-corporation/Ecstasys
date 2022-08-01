declare interface MeditationState {
  parametersMeditation?: ParametersMeditation;
  parametersMeditationStatus?: ParametersMeditationStatus;
  statisticMeditation: StatisticOject;
  meditationPopularToDay?: MeditationData;
  meditationRecommendToDay?: MeditationData;
  meditationCurrentPlayId?: string;
  favoriteMeditation: { id: string; name: string; type: MediaDecodingType }[];
}
declare interface AccountState {
  mood?: UserMood;
  user?: UserData;
  moodScore: number[];
}

declare type ParametersMeditationStatus = "exist" | "not exist";
