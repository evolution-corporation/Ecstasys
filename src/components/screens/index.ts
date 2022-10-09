/** @format */

import Intro from "./AuthorizationAndRegistration/Intro";
import SelectMethodAuthentication from "./AuthorizationAndRegistration/SelectMethodAuthentication";
import InputNumberPhone from "./AuthorizationAndRegistration/InputNumberPhone";
import InputSMSCode from "./AuthorizationAndRegistration/InputSMSCode";
import InputNickname from "./AuthorizationAndRegistration/InputNickname";
import InputImageAndBirthday from "./AuthorizationAndRegistration/InputImageAndBirthday";
import Greeting from "./AuthorizationAndRegistration/Greeting";
import EditMainUserData from "./Profile/EditMainUserData_old";
import EditUserBirthday from "./Profile/SelectDateBirthday_old";
import SelectSubscribe from "./Subscribe/SelectSubscribe";
import ResultSubscribe from "./Subscribe/ResultSubscribe";
import MeditationPracticeList from "./Practices/MeditationPracticeList";
import PlayerMeditationPractices from "./Practices/Player";
import BackgroundSound from "./Practices/BackgroundSound";
import TimerPractices from "./Practices/TimerPractices";
import IntroPractices from "./Practices/Intro";
import DMDIntro from "./Practices/IntroDMD";
import Instruction from "./Practices/Instruction";
import FavoriteMeditation from "./Profile/FavoriteMeditation_old";
import OptionsProfile from "./Profile/OptionsProfile";
import DevSettings from "./DevSetting";
import PaymentWeb from "./Subscribe/PaymentWeb";

import Main from "./Main/Main";
import Profile from "./Profile/Profile";
import PracticesList from "./Practices/PracticesList";
import { AccountStatus, RootScreenProps, RootStackList } from "~types";

export const TabsScreen = {
	Main,
	Profile,
	PracticesList,
};

export const StackScreen: {
	[key in keyof RootStackList]?: [RootScreenProps<key>, AccountStatus];
} = {
	//AccountStatus.NO_AUTHENTICATION
	Intro: [Intro, AccountStatus.NO_AUTHENTICATION],
	SelectMethodAuthentication: [SelectMethodAuthentication, AccountStatus.NO_AUTHENTICATION],
	InputNumberPhone: [InputNumberPhone, AccountStatus.NO_AUTHENTICATION],
	InputSMSCode: [InputSMSCode, AccountStatus.NO_AUTHENTICATION],
	// AccountStatus.REGISTRATION
	InputNickname: [InputNickname, AccountStatus.NO_REGISTRATION],
	InputImageAndBirthday: [InputImageAndBirthday, AccountStatus.NO_REGISTRATION],
	Greeting: [Greeting, AccountStatus.NO_REGISTRATION],
	//AccountStatus.REGISTRATION
	EditMainUserData: [EditMainUserData, AccountStatus.REGISTRATION],
	EditUserBirthday: [EditUserBirthday, AccountStatus.REGISTRATION],
	SelectSubscribe: [SelectSubscribe, AccountStatus.REGISTRATION],
	// ResultSubscribe: [ResultSubscribe, AccountStatus.REGISTRATION],
	MeditationPracticeList: [MeditationPracticeList, AccountStatus.REGISTRATION],
	// PlayerMeditationPractices: [
	//   PlayerMeditationPractices,
	//   AccountStatus.REGISTRATION,
	// ],
	// BackgroundSound: [BackgroundSound, AccountStatus.REGISTRATION],
	// TimerPractices: [TimerPractices, AccountStatus.REGISTRATION],
	IntroPractices: [IntroPractices, AccountStatus.REGISTRATION],
	// DMDIntro: [DMDIntro, AccountStatus.REGISTRATION],
	Instruction: [Instruction, AccountStatus.REGISTRATION],
	FavoriteMeditation: [FavoriteMeditation, AccountStatus.REGISTRATION],
	OptionsProfile: [OptionsProfile, AccountStatus.REGISTRATION],
	// PaymentWeb: [PaymentWeb, AccountStatus.REGISTRATION],
};
