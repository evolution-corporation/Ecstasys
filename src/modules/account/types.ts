// @ts-ignore
import type { FC } from 'react'
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import type {FirebaseAuthTypes} from "@react-native-firebase/auth";

export type AccountStackList = {
	SelectMethodAuthentication: undefined;
	SMSCodeInput: undefined;
	NumberInput: undefined;
	InputNickName: undefined;
	InputImageAndBirthday: undefined;
	Profile: undefined,
	EditMainUserData: undefined,
	EditBirthday: undefined,
	Root: undefined
};


export type AccountStackScreenProps<T extends keyof AccountStackList> =
	FC<NativeStackScreenProps<AccountStackList, T>>;

export interface UserDataApplication  {
	name?: string;
	surname?: string
	uid: string;
	subscribeInfo?: SubscribeInfo;
	image?: string;
	birthday: string;
	nickName: string;
}

export interface UserDataServer {
	Status?: string;
	Role: UserRole;
	Gender: UserGender;
	Category: UserCategory;
	Display_name?: string;
	Uid: string;
	SubscribeInfo?: SubscribeInfo;
	Image?: string;
	Birthday: string;
	NickName: string;
}

export interface UpdateUserData {
	name?: string;
	surname?: string
	image?: string;
	birthday?: Date;
	nickName?: string;
}

export interface State {
	userData?:UserDataApplication
	registrationStatus?:'registration' | 'noRegistration'
	authenticationStatus:'authentication' | 'noAuthentication'
	editUserData?:UpdateUserData,
	confirmResultByPhone?: FirebaseAuthTypes.ConfirmationResult,
	phone?: string
}

export type Action = ActionReducerNoWithPayload<'out'> | ActionReducerWithPayload<'in', UserDataApplication | null>
	| ActionReducerWithPayload<'edit', UpdateUserData> | ActionReducerWithPayload<'registration', UserDataApplication>
	| ActionReducerWithPayload<'update', UserDataApplication>
	| ActionReducerWithPayload<'authorizationByPhone', { confirm: FirebaseAuthTypes.ConfirmationResult, phone: string }>


export interface Func {
	editUserData: (payload: UpdateUserData) => Promise<void>
	registration: () => Promise<void>
	update: () => Promise<void>
	authenticationWithPhone: (phone: string) => Promise<void>
	requestSMSCode: () => Promise<void>
	checkSMSCode: (code: string) => Promise<void>
}