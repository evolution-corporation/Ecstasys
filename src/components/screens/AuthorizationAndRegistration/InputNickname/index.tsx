import React, { useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import { ColorButton } from "~components/dump";
import Tools from "~core";
import { contextHook } from "~modules/account";

import { NicknameWithVariable } from "./components";

const InputLoginScreen = ({}) => {
  const { func } = contextHook.account();
  const [statusChecked, setStatusChecked] = useState<boolean>(false);

  return (
    <View style={styles.background}>
      <NicknameWithVariable
        onEndChange={(nickName, status) => {
          setStatusChecked(status === "FREE");
          func.editUserData({ nickName });
        }}
      />
      <Text style={styles.subText}>
        {Tools.i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}
      </Text>
      <ColorButton>{Tools.i18n.t("continue")}</ColorButton>
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
