import React, { useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import ColorButton from "~components/ColorButton";
import NicknameInput from "~components/NicknameInput";
import i18n from "~i18n";
import { colors, styleText } from "~styles";

import {AccountStackScreenProps} from "~modules/account/types";
import {useAccountContext} from "~modules/account/context";

const InputLoginScreen: AccountStackScreenProps<"InputNickName"> = ({ navigation }) => {
  const nickname = useRef({ text: "", permission: false });
  const accountState = useAccountContext()
  const saveNickName = async () => {
    if (nickname.current.permission) {
      await accountState.func.editUserData({ nickName: nickname.current.text });
      navigation.navigate("InputImageAndBirthday");
    }
  }
  return (
    // @ts-ignore
    <View style={styles.background}>
      <NicknameInput
        onEndChange={(nicknameInput: string, permission: boolean) => {
          nickname.current = {
            text: nicknameInput,
            permission,
          };
        }}
        showMessage
        generateNickname
        autFocus
      />
      <ColorButton
        text={i18n.t("continue")}
        onPress={()=>saveNickName()}
        type={"fullWidth"}
        styleButton={styles.ColorButtonStyle}
      />
      {/* @ts-ignore */ }
      <Text style={styleText.helpMessage}>
        {i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    paddingBottom: 75,
    justifyContent: "flex-start",
    backgroundColor: colors.moreViolet,
    flex: 1,
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

export default InputLoginScreen;
