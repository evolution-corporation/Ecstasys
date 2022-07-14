import React, { FC, useRef, useContext, useEffect } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import NumberInput from "~components/NumberInput";
import ColorButton from "~components/ColorButton";
import i18n from "~i18n";
import BackgroundGradient from "~containers/BackgroundGradient";
import AuthorizationWithPhoneContext from "~contexts/authorizationWithPhone";
import style, { colors } from "~styles";

const NumberInputScreen: FC<
  NativeStackScreenProps<AuthorizationByPhoneParamList, "NumberInput">
> = ({ navigation }) => {
  const NumberPhone = useRef<{ numberPhone: string; isValidate: boolean }>({
    numberPhone: "",
    isValidate: false,
  });
  const AuthorizationWithPhone = useContext(AuthorizationWithPhoneContext);

  const requestSMSCode = async () => {
    if (NumberPhone.current.isValidate && !!NumberPhone.current.numberPhone) {
      await AuthorizationWithPhone?.requestSMSCode(
        NumberPhone.current.numberPhone
      );
      navigation.navigate("SMSCodeInput");
    }
  };

  return (
    <BackgroundGradient
      isImage={true}
      imageName={"leaves"}
      style={styles.background}
      title={i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae")}
    >
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
    </BackgroundGradient>
  );
};

export default NumberInputScreen;

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 20,
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
