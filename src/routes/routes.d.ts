declare type RegistrationStackParamList = {
  Registration: undefined;
};

declare type AuthorizationStackParamList = {
  AuthorizationByPhone: undefined;
  SelectMethodAuthentication: undefined;
};

declare type AuthorizationByPhoneParamList = {
  SMSCodeInput: undefined;
  NumberInput: undefined;
};

declare type RootStackParametersList = {
  TabNavigator: undefined;
  EditMeditationsParameters: undefined;
  SelectMood: undefined;
  MeditationListener: { meditationID: string };
  MeditationPracticeList: { typeMeditation: TypeMeditation };
  Options: undefined;
  Profile: undefined;
  EditUserData: undefined;
  FavoriteMeditationList: undefined;
};

declare type RootStackScreenProps<T extends keyof RootStackParametersList> =
  StackScreenProps<RootStackParametersList, T>;

declare type EditMeditationsParametersList = {
  SelectDate: undefined;
  SelectTime: undefined;
  SelectType: { time: Time_ParameterMeditation };
  ScreenFinallyResult: { result: boolean };
};
declare type EditMeditationsScreenProps<
  T extends keyof EditMeditationsParametersList
> = StackScreenProps<EditMeditationsParametersList, T>;

declare type MeditationListenerParametersList = {
  Player: MeditationData;
  BackgroundMusic: undefined;
};
declare type MeditationListenerScreenProps<
  T extends keyof MeditationListenerParametersList
> = StackScreenProps<MeditationListenerParametersList, T>;

declare type TabNavigatorParametersList = {
  Start: undefined;
  Practices: undefined;
};

declare type TabNavigatorScreenProps<
  T extends keyof TabNavigatorParametersList
> = CompositeScreenProps<TabNavigatorParametersList, T>;

declare type MainStackScreenProps<T extends keyof MainStackParametersList> =
  StackScreenProps<MainStackParametersList, T>;

declare type EditUserDataList = {
  EditMainUserData: undefined;
  SelectBirthday: undefined;
};
declare type EditUserDataScreenProps<T extends keyof EditUserDataList> =
  StackScreenProps<EditUserDataList, T>;
