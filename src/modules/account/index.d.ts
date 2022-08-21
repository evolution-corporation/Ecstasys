declare type RegistrationStack = {
    InputNickName: undefined;
    InputImageAndBirthday: undefined;
};


declare type RegistrationStackScreenProps<T extends keyof RegistrationStack> =
    StackScreenProps<RegistrationStack, T>;



export interface UserDataApplication  {
  name?: string;
  surname?: string
  uid: string;
  subscribeInfo?: SubscribeInfo;
  image?: string;
  birthday: string;
  nickName: string;
}

export  interface UserDataServer {
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