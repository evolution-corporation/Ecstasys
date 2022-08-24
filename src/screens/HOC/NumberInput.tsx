import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import NumberInput from "~components/NumberInput";
import ColorButton from "~components/ColorButton";
import i18n from "~i18n";
import style, { colors } from "~styles";
import { useAccountContext } from "~modules/account/context";

import {AccountStackScreenProps} from "~modules/account/types";

const NumberInputScreen: AccountStackScreenProps<"NumberInput"> = ({ navigation }) => {
  const NumberPhone = useRef<{ numberPhone: string; isValidate: boolean }>({
    numberPhone: "",
    isValidate: false,
  });
  const accountState = useAccountContext()

  const requestSMSCode = async () => {
    if (NumberPhone.current.isValidate && !!NumberPhone.current.numberPhone) {
      await accountState.func.authenticationWithPhone(NumberPhone.current.numberPhone)
      navigation.navigate("SMSCodeInput");
    }
  };

  return (
    //@ts-ignore
    <View style={styles.background}>
      <NumberInput
        onChange={(numberPhone: string, isValidate: boolean) => {
          NumberPhone.current = { numberPhone, isValidate };
        }}
      />
      <ColorButton
        type="fullWidth"
        text={i18n.t("continue")}
        styleButton={styles.colorButton}
        onPress={requestSMSCode}
      />
    </View>
  );
};

export default NumberInputScreen;

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 20,
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  colorButton: {
    marginTop: 14,
  },
  firebaseRecaptchaBanner: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
  firebaseRecaptchaBannerText: {
    textAlign: "center",
    color: colors.white,
    ...style.getFontOption("400"),
  },
});
