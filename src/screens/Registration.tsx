import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import BackgroundGradient from "~containers/BackgroundGradient";
import ColorButton from "~components/ColorButton";
import NicknameInput from "~components/NicknameInput";
import SelectBirthday from "~components/SelectBirthday";
import SelectImageButton from "~components/SelectImageButton";
import i18n from "~i18n";
import style, { colors, styleText } from "~styles";
import auth from "@react-native-firebase/auth";

import { useAppDispatch } from "~store/index";
import { registration } from "~store/account";

export default class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      screenPart: ScreenPart.InputNickname,
      nickName: "",
      permission: false,
      birthday: new Date(),
    };
  }
  render() {
    let screenPart = null;
    switch (this.state.screenPart) {
      case ScreenPart.InputNickname:
        screenPart = (
          <View style={style.fullWidth}>
            <NicknameInput
              onEndChange={(nickname: string, permission: boolean) =>
                this.dispatch({
                  type: "InputNickname",
                  payload: { nickname, permission },
                })
              }
              showMessage
              generateNickname
              autFocus
            />
            <ColorButton
              text={i18n.t("continue")}
              onPress={() => this.dispatch({ type: "OpenNextScreen" })}
              type={"fullWidth"}
              styleButton={styles.ColorButtonStyle}
            />
            <Text style={styleText.helpMessage}>
              {i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}
            </Text>
          </View>
        );
        break;
      case ScreenPart.SelectPhotoUserAndDateBirthday:
        screenPart = (
          <>
            <View style={style.fullWidth}>
              <Text style={styleText.subTitle}>
                {i18n.t("f22ace97-97e5-4f87-b1b7-c179f1d7e893")}
              </Text>
              <SelectImageButton
                style={styles.selectImage}
                onChangeImage={({ base64 }) => {
                  this.dispatch({
                    type: "SelectImage",
                    payload: base64,
                  });
                }}
                typeReturn={"base64"}
              />
              <SelectBirthday
                onChange={(date) => {
                  this.dispatch({ type: "SelectBirthday", payload: date });
                }}
              />
            </View>
            <ColorButton
              text={i18n.t("01e5182d-f190-4bcb-9668-36a193e18325")}
              type={"fullWidth"}
              onPress={() => this.Registration()}
            />
          </>
        );
    }
    return (
      <BackgroundGradient style={styles.background}>
        {screenPart}
      </BackgroundGradient>
    );
  }

  private dispatch(action: Action) {
    const state = { ...this.state };
    switch (action.type) {
      case "InputNickname":
        state.nickName = action.payload.nickname;
        state.permission = action.payload.permission;
        break;
      case "OpenNextScreen":
        switch (state.screenPart) {
          case ScreenPart.InputNickname:
            if (state.permission) {
              state.screenPart = ScreenPart.SelectPhotoUserAndDateBirthday;
            }
            break;
        }
        break;
      case "SelectBirthday":
        state.birthday = action.payload;
        break;
      case "SelectImage":
        state.image = action.payload;
        break;
    }
    this.setState(state);
  }

  private Registration() {
    const data = {
      nickname: this.state.nickName,
      birthday: this.state.birthday,
      image: this.state.image,
      displayName: auth().currentUser?.displayName ?? this.state.nickName,
    };
    useAppDispatch(registration(data));
  }
}

interface Props {}
interface State {
  screenPart: ScreenPart;
  nickName: string;
  permission: boolean;
  birthday: Date;
  image?: string;
}

enum ScreenPart {
  InputNickname,
  SelectPhotoUserAndDateBirthday,
}

type Action =
  | ActionReducerWithPayload<
      "InputNickname",
      { nickname: string; permission: boolean }
    >
  | ActionReducerNoWithPayload<"OpenNextScreen">
  | ActionReducerWithPayload<"SelectImage", string | undefined>
  | ActionReducerWithPayload<"SelectBirthday", Date>;

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    paddingBottom: 75,
    justifyContent: "space-between",
  },
  ColorButtonStyle: { marginVertical: 10 },
  selectImage: {
    height: 124,
    width: 124,
    borderRadius: 30,
    borderColor: colors.StrokePanel,
    borderWidth: 3,
    backgroundColor: colors.WhiteGlass,
    marginVertical: 72,
  },
});
