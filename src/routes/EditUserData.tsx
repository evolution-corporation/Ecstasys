import React, { FC, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditUserDataContext from "~contexts/editUserData";
import { useAppDispatch } from "~store";
import { updateData } from "~store/account";

import i18n from "~i18n";
import EditMainUserData from "~screens/EditMainUserData";
import SelectDateBirthday from "~screens/modals/SelectDateBirthday";

const EdiUserDataStack = createNativeStackNavigator<EditUserDataList>();

const EditMeditationsParametersRoutes: FC<
  RootStackScreenProps<"EditUserData">
> = () => {
  const dispatch = useAppDispatch();
  const modifiedUserData = useRef<{
    image?: string;
    name?: string;
    subname?: string;
    nickname?: string;
    birthday?: { year: number; month: number; day: number };
  }>({});

  const saveData = async () => {
    await dispatch(
      updateData({
        ...modifiedUserData.current,
        dateBirthday: modifiedUserData.current.birthday
          ? new Date(
              modifiedUserData.current.birthday.year,
              modifiedUserData.current.birthday.month,
              modifiedUserData.current.birthday.day + 1
            )
          : undefined,
      })
    ).unwrap();
  };

  return (
    <EditUserDataContext.Provider
      value={{
        editBirthday: (payload) => {
          modifiedUserData.current.birthday = payload;
        },
        editName: (payload) => {
          modifiedUserData.current.name = payload;
        },
        editNickname: (payload) => {
          modifiedUserData.current.nickname = payload;
        },
        editSubname: (payload) => {
          modifiedUserData.current.subname = payload;
        },
        editImage: (payload) => {
          modifiedUserData.current.image = payload;
        },
        modifiedUserData: modifiedUserData.current,
        saveData,
      }}
    >
      <EdiUserDataStack.Navigator
        initialRouteName="EditMainUserData"
        screenOptions={{
          animationTypeForReplace: "pop",
          headerShown: false,
        }}
      >
        <EdiUserDataStack.Screen
          component={EditMainUserData}
          name={"EditMainUserData"}
        />
        <EdiUserDataStack.Screen
          component={SelectDateBirthday}
          name={"SelectBirthday"}
          options={{
            presentation: "transparentModal",
            gestureDirection: "vertical",
            animation: "slide_from_bottom",
          }}
        />
      </EdiUserDataStack.Navigator>
    </EditUserDataContext.Provider>
  );
};

export default EditMeditationsParametersRoutes;
