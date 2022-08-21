import React, { ElementRef, FC, useContext, useRef, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import SMSCodeInput, {
  SMSCodeInputInfo,
  SMSCodeInputInfoShow,
} from "~components/SMSCodeInput";
import i18n from "~i18n";
import { colors, styleText, toastOptions } from "~styles";
import Toast from "react-native-root-toast";

import {AccountStackScreenProps} from "../types";
import {useAccountContext} from "../context";

const SMSCodeInputScreen: AccountStackScreenProps< "SMSCodeInput"> = ({  }) => {
  const refSMSCodeInput = useRef<ElementRef<typeof SMSCodeInput>>(null);
  const accountState = useAccountContext()
  const [SMSRequestStatus, setSMSRequestStatus] =
    useState<SMSCodeInputInfoShow>(SMSCodeInputInfoShow.requestSMS);
  const checkSMSCode = async (code: string) => {
    try {
      await accountState.func.checkSMSCode(code)
    } catch (error) {
      Toast.show(i18n.t("cb73fed3-bf9e-4621-8db3-fc9471991792"), toastOptions);
    }
  };

  const requestSMS = async () => {
    setSMSRequestStatus(SMSCodeInputInfoShow.loadingIndicator);
    refSMSCodeInput.current?.clear();
    await accountState.func.requestSMSCode();
    setSMSRequestStatus(SMSCodeInputInfoShow.requestSMS);
  };

  return (
    //@ts-ignore
    <View style={styles.background}>
      {/* @ts-ignore*/}
      <Text style={styles.header}>
        {i18n.t("cfdefbe6-ae49-4e17-8628-bbe46d144418")}
      </Text>
      <SMSCodeInput ref={refSMSCodeInput} autoFocus onEndInput={checkSMSCode} />
      <SMSCodeInputInfo
        status={SMSRequestStatus}
        style={styles.SMSCodeInputInfoStyle}
        onPress={requestSMS}
        seconds={60}
      />
    </View>
  );
};

export default SMSCodeInputScreen;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  SMSCodeInputInfoStyle: {
    marginTop: 20,
  },
  header: {
    marginBottom: 25,
    color: colors.white,
    ...styleText.h1,
  },
});
