import React, { useEffect, useRef, useState} from "react";
import { StyleSheet, TextInput, View } from "react-native";
import i18n from "~i18n";
import style, { colors } from "~styles";
import SelectImageButton from "~components/SelectImageButton";
import NicknameInput from "~components/NicknameInput";
import ColorButton from "~components/ColorButton";
import {AccountStackScreenProps, UpdateUserData} from "../types";
import {useAccountContext} from "../context";
const EditMainUserDataScreen: AccountStackScreenProps<"EditMainUserData"> = ({
  navigation,
}) => {
  const accountState = useAccountContext()
  if (!accountState.user) {
    throw new Error("Need Registration")
  }
  const editData = useRef<UpdateUserData>({}).current
  const permission = useRef<{ status?: boolean }>({}).current
  const [birthday, setBirthday] = useState<string>(()=>{
    if (!accountState.user) throw new Error("Need Registration")
    return i18n.normalizedDate(new Date(accountState.user.birthday))}
  )

  useEffect(()=>{
    if (!!accountState.state.editUserData?.birthday) {
      setBirthday(
        i18n.normalizedDate(accountState.state.editUserData?.birthday)
      )
    }
  },[accountState.state.editUserData?.birthday])

  const updateData = async () => {
    await accountState.func.update()
  };

  return (
    // @ts-ignore
    <View style={styles.background}>
      {/* @ts-ignore */}
      <View style={style.fullWidth}>
        <SelectImageButton
          style={styles.buttonEditImage}
          onChangeImage={({ base64 }) => {
            if (base64) {
              editData.image = base64
            }
          }}
          initImage={accountState.user.image}
          typeReturn={"base64"}
        />
        {/* @ts-ignore */}
        <TextInput
          style={styles.TextInputTransparent}
          key={"name"}
          placeholder={i18n.t("b89f2757-8b5e-4a08-b8f8-1bbe87834f3e")}
          placeholderTextColor={colors.DarkGlass}
          onChangeText={(text) => {
            editData.name = text
          }}
          defaultValue={accountState.user.name}
        />
        {/* @ts-ignore */}
        <TextInput
          style={styles.TextInputTransparent}
          key={"surname"}
          placeholder={i18n.t("744e3c17-2c94-44a2-a808-5d0420b01d61")}
          placeholderTextColor={colors.DarkGlass}
          onChangeText={(text) => {
            editData.surname = text
          }}
          defaultValue={accountState.user.surname}
        />

        <NicknameInput
          nickNameInit={accountState.user.nickName}
          checkInitLogin={false}
          generateNickname={false}
          onEndChange={(nickName, status) => {
            if (status) {
              editData.nickName = nickName
            }
            permission.status = status
          }}
          styleNicknameInputView={styles.editNickname}
        />
        <ColorButton
          type="fullWidth"
          text={birthday}
          icon={"Pencil"}
          styleButton={styles.buttonViewEditBirthday}
          styleText={styles.buttonTextEditBirthday}
          iconPosition={"right"}
          onPress={() => navigation.navigate("EditBirthday")}
        />
      </View>
      <ColorButton
        text={i18n.t("save")}
        styleButton={styles.saveButton}
        styleText={styles.saveButtonText}
        type={"fullWidth"}
        onPress={() => updateData()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    justifyContent: "space-between",
    paddingBottom: 80,
    backgroundColor: colors.moreViolet,
    flex: 1,
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
