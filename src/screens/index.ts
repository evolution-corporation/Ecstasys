/** @format */

export { default as Intro } from "./AuthorizationAndRegistration/Intro";
export { default as SelectMethodAuthentication } from "./SelectMethodAuthentication";
export { default as InputNumberPhone } from "./AuthorizationAndRegistration/InputNumberPhone";
export { default as InputSMSCode } from "./AuthorizationAndRegistration/InputSMSCode";
export { default as InputNickname } from "./InputNickname";
export { default as InputImageAndBirthday } from "./InputImageAndBirthday";
export { default as Greeting } from "./AuthorizationAndRegistration/Greeting";
export { default as EditUser } from "./EditUser";
export { default as EditUserBirthday } from "./EditUserBirthday";
export { default as SelectSubscribe } from "./Subscribe/SelectSubscribe";
export { default as ResultSubscribe } from "./Subscribe/ResultSubscribe";
export { default as PracticeListByType } from "./PracticeListByType";
export { default as PlayerMeditationPractices } from "./PlayerForPractice";
export { default as SelectTimeForRelax } from "./SelectTimeForRelax";
export { default as IntroPractices } from "./Practices/Intro";
export { default as DMDIntro } from "./Practices/IntroDMD";
export { default as Instruction } from "./Practices/Instruction";
export { default as FavoriteMeditation } from "./Profile/FavoriteMeditation_old";
export { default as Options } from "./Options";
export { default as PaymentWeb } from "./Subscribe/PaymentWeb";

export { default as Main } from "./Main";
export { default as Profile } from "./Profile";
export { default as PracticesList } from "./PracticesMeditationList";
export { default as PlayerForPractice } from "./PlayerForPractice";
export { default as SelectBackgroundSound } from "./SelectBackgroundSound";
export { default as PlayerForDMD } from "./PlayerForDMD";
export { default as DMDSettingNotification } from "./DMDSettingNotification";
export { default as DMDSelectTimeBright } from "./DMDSelectTimeBright";
// export const TabsScreen = {
// 	Main,
// 	Profile,
// 	PracticesList,
// };

// export const StackScreen: {
// 	[key in keyof RootStackList]?: [RootScreenProps<key>, AccountStatus];
// } = {
// 	//AccountStatus.NO_AUTHENTICATION
// 	Intro: [Intro, AccountStatus.NO_AUTHENTICATION],
// 	SelectMethodAuthentication: [SelectMethodAuthentication, AccountStatus.NO_AUTHENTICATION],
// 	InputNumberPhone: [InputNumberPhone, AccountStatus.NO_AUTHENTICATION],
// 	InputSMSCode: [InputSMSCode, AccountStatus.NO_AUTHENTICATION],
// 	// AccountStatus.REGISTRATION
// 	InputNickname: [InputNickname, AccountStatus.NO_REGISTRATION],
// 	InputImageAndBirthday: [InputImageAndBirthday, AccountStatus.NO_REGISTRATION],
// 	Greeting: [Greeting, AccountStatus.NO_REGISTRATION],
// 	//AccountStatus.REGISTRATION
// 	EditMainUserData: [EditMainUserData, AccountStatus.REGISTRATION],
// 	EditUserBirthday: [EditUserBirthday, AccountStatus.REGISTRATION],
// 	SelectSubscribe: [SelectSubscribe, AccountStatus.REGISTRATION],
// 	// ResultSubscribe: [ResultSubscribe, AccountStatus.REGISTRATION],
// 	PracticeListByType: [PracticeListByType, AccountStatus.REGISTRATION],
// 	// PlayerMeditationPractices: [
// 	//   PlayerMeditationPractices,
// 	//   AccountStatus.REGISTRATION,
// 	// ],
// 	// BackgroundSound: [BackgroundSound, AccountStatus.REGISTRATION],
// 	// TimerPractices: [TimerPractices, AccountStatus.REGISTRATION],
// 	IntroPractices: [IntroPractices, AccountStatus.REGISTRATION],
// 	// DMDIntro: [DMDIntro, AccountStatus.REGISTRATION],
// 	Instruction: [Instruction, AccountStatus.REGISTRATION],
// 	FavoriteMeditation: [FavoriteMeditation, AccountStatus.REGISTRATION],
// 	OptionsProfile: [OptionsProfile, AccountStatus.REGISTRATION],
// 	// PaymentWeb: [PaymentWeb, AccountStatus.REGISTRATION],
// 	Player: [PlayerScreen, AccountStatus.REGISTRATION],
// };
