import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import i18n from "~i18n";
import Icon from "~assets/icons";
import BackgroundGradient from "~containers/BackgroundGradient";
import style, { colors } from "~styles";
import { useAppDispatch, useAppSelector } from "~store";
import SelectImageButton from "~components/SelectImageButton";
import NicknameInput from "~components/NicknameInput";
import ColorButton from "~components/ColorButton";
import editUserDataContext from "~contexts/editUserData";
import { useNetInfo } from "@react-native-community/netinfo";
import { updateData } from "~store/account";
import { useEffect } from "react";

const EditMainUserDataScreen: FC<RootStackScreenProps<"EditUserData">> = ({
  navigation,
}) => {
  const user = useAppSelector((state) => state.account.user);
  const [permissionNickName, setPermissionNickName] = useState<boolean>(true);
  const editUserData = useContext(editUserDataContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (user == null || editUserData == null) return null;

  const updateData = async () => {
    setIsLoading(true);
    await editUserData.saveData();
    setIsLoading(false);
  };

  const dateBirthdayStr = useMemo(() => {
    return i18n.normalizedDate(
      editUserData.modifiedUserData.birthday
        ? new Date(
            editUserData.modifiedUserData.birthday.year,
            editUserData.modifiedUserData.birthday.month,
            editUserData.modifiedUserData.birthday.day
          )
        : new Date(user.birthday)
    );
  }, [editUserData.modifiedUserData.birthday]);

  return (
    <BackgroundGradient
      isImage={true}
      imageName={"leaves"}
      style={styles.background}
    >
      <View style={style.fullWidth}>
        <SelectImageButton
          style={styles.buttonEditImage}
          onChangeImage={({ base64 }) => {
            if (base64) {
              editUserData.editImage(base64);
            }
          }}
          initImage={user?.image}
          typeReturn={"base64"}
        />
        <TextInput
          style={styles.TextInputTransparent}
          key={"name"}
          placeholder={i18n.t("b89f2757-8b5e-4a08-b8f8-1bbe87834f3e")}
          placeholderTextColor={colors.DarkGlass}
          onChangeText={(text) => editUserData.editName(text)}
          defaultValue={user?.name}
        />

        <TextInput
          style={styles.TextInputTransparent}
          key={"subName"}
          placeholder={i18n.t("744e3c17-2c94-44a2-a808-5d0420b01d61")}
          placeholderTextColor={colors.DarkGlass}
          onChangeText={(text) => editUserData.editSubname(text)}
          defaultValue={user?.subname}
        />

        <NicknameInput
          nickNameInit={user?.nickname}
          checkInitLogin={false}
          generateNickname={false}
          onEndChange={(nickName, status) => {
            editUserData.editNickname(nickName);
            setPermissionNickName(status);
          }}
          styleNicknameInputView={styles.editNickname}
        />
        <ColorButton
          type="fullWidth"
          text={dateBirthdayStr}
          icon={"Pencil"}
          styleButton={styles.buttonViewEditBirthday}
          styleText={styles.buttonTextEditBirthday}
          iconPosition={"right"}
          onPress={() => navigation.navigate("SelectBirthday")}
        />
      </View>
      <ColorButton
        text={i18n.t("save")}
        styleButton={styles.saveButton}
        styleText={styles.saveButtonText}
        type={"fullWidth"}
        onPress={() => updateData()}
      />
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  editSettingName: {
    marginLeft: 33,
    color: colors.white,
    fontSize: 15,
    ...style.getFontOption("400"),
  },
  buttonEditImage: {
    width: 92,
    height: 92,
    backgroundColor: colors.TextOnTheBackground,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.white,
  },
  TextInputTransparent: {
    color: colors.white,
    fontSize: 14,
    ...style.getFontOption("400"),
    paddingRight: 44,
    width: "100%",
    height: 45,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.grayGlass,
    paddingHorizontal: 15,
    borderColor: colors.StrokePanel,
    marginVertical: 7.5,
  },
  editNickname: {
    marginVertical: 7.5,
  },
  inputDateBirthDay: {
    marginVertical: 7.5,
  },
  buttonViewEditBirthday: {
    backgroundColor: colors.grayGlass,
    borderColor: colors.StrokePanel,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 7.5,
  },
  buttonTextEditBirthday: {
    color: colors.white,
    textAlign: "left",
    flex: 1,
    marginLeft: 20,
  },
  saveButton: {
    backgroundColor: colors.StrokePanel,
  },
  saveButtonText: {
    color: colors.white,
  },
});

export default EditMainUserDataScreen;
