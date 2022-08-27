import React, { ElementRef, useCallback, useRef, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { contextHook } from "~modules/account";

import Tools from "~core";

import {
  SMSCodeInput,
  SMSCodeInputInfo,
  SMSCodeInputInfoShow,
} from "./components";

const SMSCodeInputScreen = () => {
  const refSMSCodeInput = useRef<ElementRef<typeof SMSCodeInput>>(null);
  const [status, setStatus] = useState<SMSCodeInputInfoShow>(
    SMSCodeInputInfoShow.requestSMS
  );
  const { func } = contextHook.account();

  const checkSMSCode = useCallback(
    async (code: string) => {
      setStatus(SMSCodeInputInfoShow.loadingIndicator);
      await func.checkSMSCode(code).catch(console.error);
    },
    [refSMSCodeInput]
  );

  const reRequestSMSCode = useCallback(async () => {
    setStatus(SMSCodeInputInfoShow.loadingIndicator);
    // await func.requestSMSCode().catch(console.error)
    setStatus(SMSCodeInputInfoShow.requestSMS);
  }, [refSMSCodeInput]);

  return (
    <View style={styles.background}>
      <Text style={styles.header}>
        {Tools.i18n.t("cfdefbe6-ae49-4e17-8628-bbe46d144418")}
      </Text>
      <SMSCodeInput ref={refSMSCodeInput} autoFocus onEndInput={checkSMSCode} />
      <SMSCodeInputInfo
        status={status}
        style={styles.SMSCodeInputInfoStyle}
        onPress={reRequestSMSCode}
        seconds={10}
      />
    </View>
  );
};

export default SMSCodeInputScreen;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9765A8",
    flex: 1,
  },
  SMSCodeInputInfoStyle: {
    marginTop: 20,
  },
  header: {
    marginBottom: 25,
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("700"),
  },
});
