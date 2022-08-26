import React, { useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import ColorButton from "~components/ColorButton";
import NicknameInput from "~components/NicknameInput";
import Tools from "~core";

import { contextHook } from "~modules/account";
import { NicknameWithVariable } from "~components/dump";

const InputLoginScreen = ({}) => {
  const nickname = useRef({ text: "", permission: false });
  // const accountState = useAccountContext();
  const saveNickName = async () => {
    if (nickname.current.permission) {
      // await accountState.func.editUserData({ nickName: nickname.current.text });
    }
  };
  return (
    <View style={styles.background}>
      <NicknameWithVariable />
      <Text style={styles.subText}>
        {Tools.i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    paddingBottom: 75,
    justifyContent: "flex-start",
    backgroundColor: "#9765A8",
    flex: 1,
  },
  ColorButtonStyle: { marginVertical: 10 },
  subText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#E7DDEC",
    ...Tools.gStyle.font("400"),
  },
});

export default InputLoginScreen;
