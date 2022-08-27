import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { ColorButton } from "~components/dump";
import { contextHook } from "~modules/account";
import Tools from "~core";

import { NumberInput } from "./components";

const NumberInputScreen = () => {
  const NumberPhone = useRef<{ numberPhone: string; isValidate: boolean }>({
    numberPhone: "",
    isValidate: false,
  });
  const { func } = contextHook.account();

  const requestSMSCode = useCallback(async () => {
    if (NumberPhone.current.isValidate && !!NumberPhone.current.numberPhone) {
      await func.authenticationWithPhone(NumberPhone.current.numberPhone);
    }
  }, []);

  return (
    <View style={styles.background}>
      <NumberInput
        onChange={(numberPhone: string, isValidate: boolean) => {
          NumberPhone.current = { numberPhone, isValidate };
        }}
      />
      <ColorButton styleButton={styles.colorButton} onPress={requestSMSCode}>
        {Tools.i18n.t("continue")}
      </ColorButton>
    </View>
  );
};

export default NumberInputScreen;

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 20,
    backgroundColor: "#9765A8",
    flex: 1,
  },
  colorButton: {
    marginTop: 14,
  },
});
