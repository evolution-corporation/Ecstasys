/** @format */

import { useFocusEffect } from "@react-navigation/native";
import React, { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import i18n from "~i18n";

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
				await appDispatch(actions.signInAccount()).unwrap();
			}
		},
		[confirm]
	);

	const requestSMSCode = useCallback(async () => {
		setStatus(SMSCodeInputInfoShow.loadingIndicator);
		const start = Date.now();
		const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
		console.log("signInWithPhoneNumber", confirm, phoneNumber, Date.now() - start);
		setConfirm(confirmation);
		setStatus(SMSCodeInputInfoShow.requestSMS);
	}, [phoneNumber]);

	useFocusEffect(
		useCallback(() => {
			requestSMSCode();
		}, [phoneNumber])
	);

	return (
		<View style={styles.background}>
			<StatusBar style="light" backgroundColor="#9765A8" hidden={false} />
			<Text style={styles.header}>{i18n.t("cfdefbe6-ae49-4e17-8628-bbe46d144418")}</Text>
			<SMSCodeInput ref={refSMSCodeInput} autoFocus onEndInput={checkSMSCode} />
			<SMSCodeInputInfo status={status} style={styles.SMSCodeInputInfoStyle} onPress={requestSMSCode} seconds={160} />
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
