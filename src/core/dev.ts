import { useEffect, useRef, useState } from "react";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";

import {
  UserDataApplication,
  UserDataServer,
  UpdateUserData,
} from "~modules/account/types";
import { ConverterUserDataToApplication } from "~modules/account/tools";

export function useApiOFF(): [boolean, (value: boolean) => void] {
  const [isApiOff, setIsApiOff] = useState<boolean>(false);
  const { getItem, setItem } = useAsyncStorage("@OffApi");
  let isActivate = false;

  useEffect(() => {
    isActivate = true;
    const init = async () => {
      const value = await getItem();
      let booleanValue = false;
      if (value === null) {
        await setItem(JSON.stringify(false));
      } else {
        booleanValue = !!JSON.parse(value);
      }
      if (isActivate) setIsApiOff(booleanValue);
    };
    if (__DEV__) {
      init().catch(console.error);
    }

    return () => {
      isActivate = false;
    };
  }, [getItem]);

  return [
    isApiOff,
    (value: boolean) => {
      setIsApiOff(value), setItem(JSON.stringify(value));
    },
  ];
}

export async function getApiOff(): Promise<boolean> {
  const value = await AsyncStorage.getItem("@OffApi");
  if (value === null) {
    return false;
  } else {
    return !!JSON.parse(value);
  }
}

export function useCustomDataUser(): [boolean, (value: boolean) => void] {
  const [isApiOff, setIsApiOff] = useState<boolean>(false);
  const { getItem, setItem } = useAsyncStorage("@IsCustomDataUser");
  let isActivate = false;

  useEffect(() => {
    isActivate = true;
    const init = async () => {
      const value = await getItem();
      let booleanValue = false;
      if (value === null) {
        await setItem(JSON.stringify(false));
      } else {
        booleanValue = !!JSON.parse(value);
      }
      if (isActivate) setIsApiOff(booleanValue);
    };
    if (__DEV__) {
      init().catch(console.error);
    }

    return () => {
      isActivate = false;
    };
  }, [getItem]);

  return [
    isApiOff,
    (value: boolean) => {
      setIsApiOff(value), setItem(JSON.stringify(value));
    },
  ];
}

export async function getIsCustomDataUser() {
  const value = await AsyncStorage.getItem("@IsCustomDataUser");
  if (value === null) {
    return false;
  } else {
    return !!JSON.parse(value);
  }
}

export async function getDevUserData(): Promise<UserDataApplication | null> {
  const value = await getIsCustomDataUser();
  if (value) {
    const userData = await AsyncStorage.getItem("@CustomDataUser");
    if (userData === null) {
      return null;
    } else {
      const _userData: UserDataServer = JSON.parse(userData) as UserDataServer;
      return ConverterUserDataToApplication(_userData);
    }
  } else {
    const user = auth().currentUser;
    if (user !== null) {
      return {
        birthday: new Date(2000, 0, 1),
        uid: user.uid,
        nickName: "test_nick",
        displayName: "Test No Api",
        image:
          "https://storage.yandexcloud.net/dmdmeditationimage/users/TestUser.jpg",
      };
    } else {
      return null;
    }
  }
}

export async function setCustomDataUser(
  data: UpdateUserData
): Promise<UserDataApplication> {
  if (await getIsCustomDataUser()) {
    const userData = await AsyncStorage.getItem("CustomDataUser");
    if (userData === null) {
      throw new Error("User not found");
    }
    const _userData: UserDataApplication = JSON.parse(userData);
    const userUpdateData: UserDataApplication = {
      ..._userData,
      ...data,
    };
    await AsyncStorage.setItem(
      "CustomDataUser",
      JSON.stringify(userUpdateData)
    );
    return userUpdateData;
  } else {
    throw new Error("Using Not Custom User Data");
  }
}

export async function createCustomerDatatUser(
  nickname: string,
  birthday: Date,
  image?: string
): Promise<UserDataApplication> {
  const user = auth().currentUser;
  if (user === null) throw new Error("Not found User");
  const userData = {
    birthday: birthday,
    uid: user.uid,
    nickName: nickname,
    image: image ? `data:image/png;base64,${image}` : undefined,
  };
  await AsyncStorage.setItem("@CustomDataUser", JSON.stringify(userData));
  return {
    ...userData,
    image: userData.image
      ? userData.image
      : "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png",
  };
}

export function useShowIntroScreen(
  key: string
): [boolean, (value: boolean) => void] {
  const [isShow, setIsShow] = useState<boolean>(false);
  const { getItem, setItem } = useAsyncStorage(key);
  let isActivate = false;
  useEffect(() => {
    isActivate = true;
    const init = async () => {
      const result = await getItem();
      let value: boolean = false;
      if (result !== null) {
        value = !!JSON.parse(result);
      }
      if (isActivate) setIsShow(value);
    };

    init().catch(console.error);
    return () => {
      isActivate = false;
    };
  }, [setIsShow]);

  return [
    isShow,
    (value: boolean) => {
      if (isActivate) {
        setIsShow(value);
        setItem(JSON.stringify(value));
      }
    },
  ];
}
