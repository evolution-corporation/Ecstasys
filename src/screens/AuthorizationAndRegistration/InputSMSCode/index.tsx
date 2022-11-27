/** @format */

import { useFocusEffect } from "@react-navigation/native";
import React, { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import i18n from "~i18n";
import { Screen } from "~components/containers";

import gStyle from "~styles";
import Tools from "~core";
import type { RootScreenProps } from "~types";

import { SMSCodeInput, SMSCodeInputInfo, SMSCodeInputInfoShow } from "./components";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { StatusBar } from "expo-status-bar";
import { actions, useAppDispatch } from "~store";

const SMSCodeInputScreen: RootScreenProps<"InputSMSCode"> = ({ route }) => {
	const { phoneNumber } = route.params;
	const refSMSCodeInput = useRef<ElementRef<typeof SMSCodeInput>>(null);
	const [status, setStatus] = useState<SMSCodeInputInfoShow>(SMSCodeInputInfoShow.requestSMS);
	const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
	const appDispatch = useAppDispatch();
	const checkSMSCode = useCallback(
		async (code: string) => {
			setStatus(SMSCodeInputInfoShow.loadingIndicator);
			if (confirm !== null) {
				await confirm.confirm(code);
				await appDispatch(actions.sigIn()).unwrap();
			}
		},
		[confirm]
	);

	const requestSMSCode = useCallback(async () => {
		setStatus(SMSCodeInputInfoShow.loadingIndicator);
		const start = Date.now();
		const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
		setConfirm(confirmation);
		setStatus(SMSCodeInputInfoShow.requestSMS);
	}, [phoneNumber]);

	useFocusEffect(
		useCallback(() => {
			requestSMSCode();
		}, [phoneNumber])
	);

	return (
		<Screen backgroundColor={"#9765A8"} styleScreen={{ justifyContent: "center", alignItems: "center" }}>
			<Text
				style={{ ...gStyle.styles.Header, color: "#FFFFFF", height: "auto", textAlign: "center", marginBottom: 20 }}
			>
				{i18n.t("cfdefbe6-ae49-4e17-8628-bbe46d144418")}
			</Text>
			<SMSCodeInput ref={refSMSCodeInput} autoFocus onEndInput={checkSMSCode} />
			<SMSCodeInputInfo status={status} style={styles.SMSCodeInputInfoStyle} onPress={requestSMSCode} seconds={160} />
		</Screen>
	);
};

export default SMSCodeInputScreen;

const styles = StyleSheet.create({
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
