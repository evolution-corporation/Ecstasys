/** @format */

import { useBackHandler } from "@react-native-community/hooks";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View, StyleSheet, Text, Platform, BackHandler } from "react-native";
import auth from "@react-native-firebase/auth";
import i18n from "~i18n";
import { Screen } from "~components/containers";

import { ColorButton, SelectImageButton, SelectBirthday } from "~components/dump";
import Tools from "~core";
import { actions, useAppDispatch } from "~store";
import { RootScreenProps } from "~types";
import { convertedImageURLInBase64 } from "~tools";
import { StatusBar } from "expo-status-bar";

const InputImageAndBirthdayScreen: RootScreenProps<"InputImageAndBirthday"> = ({ navigation }) => {
	const appDispatch = useAppDispatch();
	const SelectImageButtonRef = React.useRef<React.ElementRef<typeof SelectImageButton>>(null);
	const countBack = React.useRef<number>(0);
	const registration = async () => {
		await appDispatch(actions.registation()).unwrap();
		navigation.navigate("Greeting");
	};

	useFocusEffect(
		useCallback(() => {
			const user = auth().currentUser;
			if (!!user && user.photoURL) {
				convertedImageURLInBase64(user.photoURL).then(base64 => {
					if (!!user && user.photoURL) {
						appDispatch(actions.addChangedInformationUser({ image: base64 }));
						SelectImageButtonRef.current?.setImage(user.photoURL);
					}
				});
			}
		}, [])
	);

	useBackHandler(() => {
		if (countBack.current > 2) {
			if (Platform.OS === "android") {
				BackHandler.exitApp();
			}
			return true;
		} else {
			countBack.current += 1;
			return true;
		}
	});

	return (
		<Screen styleScreen={{ justifyContent: "space-between", paddingBottom: 20 }}>
			<View style={{ alignItems: "center" }}>
				<Text style={styles.helper}>{i18n.t("f22ace97-97e5-4f87-b1b7-c179f1d7e893")}</Text>
				<SelectImageButton
					ref={SelectImageButtonRef}
					style={styles.selectImage}
					onChangeImage={base64 => {
						if (base64) {
							appDispatch(actions.addChangedInformationUser({ image: base64 }));
						}
					}}
				/>
				<SelectBirthday
					onChange={date => {
						appDispatch(actions.addChangedInformationUser({ birthday: date }));
					}}
				/>
			</View>
			<ColorButton onPress={() => registration()}>{i18n.t("01e5182d-f190-4bcb-9668-36a193e18325")}</ColorButton>
		</Screen>
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
		marginTop: 10,
		fontSize: 14,
		lineHeight: 16,
		color: "#E7DDEC",
		textAlign: "center",
		...Tools.gStyle.font("400"),
	},
});

export default InputImageAndBirthdayScreen;
