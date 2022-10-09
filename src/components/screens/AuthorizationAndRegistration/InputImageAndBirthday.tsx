/** @format */

import { useBackHandler } from "@react-native-community/hooks";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import auth from "@react-native-firebase/auth";

import { ColorButton, SelectImageButton, SelectBirthday } from "~components/dump";
import Tools from "~core";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { RootScreenProps } from "~types";
import { convertedImageURLInBase64 } from "~tools";

const InputImageAndBirthdayScreen: RootScreenProps<"InputImageAndBirthday"> = ({}) => {
	const appDispatch = useAppDispatch();
	const { birthday, image, nickname } = useAppSelector(store => store.account.changedAccountData);
	const registration = async () => {
		if (!!birthday && !!nickname)
			appDispatch(actions.registrationAccountData({ birthday: new Date(birthday), image, nickname }));
	};

	useFocusEffect(
		useCallback(() => {
			const user = auth().currentUser;
			if (!!user && user.photoURL) {
				convertedImageURLInBase64(user.photoURL).then(base64 =>
					appDispatch(actions.setChangedAccountData({ image: base64 }))
				);
			}
		}, [])
	);

	useBackHandler(() => true);

	return (
		<View style={styles.background}>
			<View style={{ alignItems: "center" }}>
				<Text style={styles.helper}>{Tools.i18n.t("f22ace97-97e5-4f87-b1b7-c179f1d7e893")}</Text>
				<SelectImageButton
					style={styles.selectImage}
					onChangeImage={base64 => {
						if (base64) {
							appDispatch(actions.setChangedAccountData({ image: base64 }));
						}
					}}
				/>
				<SelectBirthday
					onChange={date => {
						appDispatch(actions.setChangedAccountData({ birthday: date }));
					}}
				/>
			</View>
			<ColorButton onPress={() => registration()}>{Tools.i18n.t("01e5182d-f190-4bcb-9668-36a193e18325")}</ColorButton>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 30,
		paddingBottom: 75,
		justifyContent: "space-between",
		backgroundColor: "#9765A8",
		flex: 1,
	},
	ColorButtonStyle: {
		width: "100%",
		marginVertical: 10,
	},
	selectImage: {
		height: 124,
		width: 124,
		borderRadius: 30,
		borderColor: "#C2A9CE",
		borderWidth: 3,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginVertical: 72,
	},
	helper: {
		marginTop: 20,
		fontSize: 12,
		lineHeight: 14,
		color: "#E7DDEC",
		textAlign: "center",
		...Tools.gStyle.font("500"),
	},
});

export default InputImageAndBirthdayScreen;
