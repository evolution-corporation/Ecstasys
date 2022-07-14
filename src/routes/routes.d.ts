declare type RegistrationStackParamList = {
  Registration: undefined;
};

declare type AuthorizationStackParamList = {
  AuthorizationByPhone: undefined;
  SelectMethodAuthentication: undefined;
};
declare type RootStackParamList = {
  Main: undefined;
  EditMeditationsParameters: undefined;
  SelectMood: undefined;
  MeditationListener: { meditationID: string };
};

declare type AuthorizationByPhoneParamList = {
  SMSCodeInput: undefined;
  NumberInput: undefined;
};

declare type EditMeditationsParametersList = {
  SelectDate: undefined;
  SelectTime: undefined;
  SelectType: { time: Time_ParameterMeditation };
  ScreenFinallyResult: { result: boolean };
};

declare type MeditationListenerParametersList = {
  Player: MeditationData;
};
