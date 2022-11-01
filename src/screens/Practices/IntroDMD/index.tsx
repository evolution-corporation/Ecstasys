/** @format */

import { StyleSheet, Text, View, Image } from "react-native";
import React, { useCallback } from "react";
import i18n from "~i18n";

import Core from "~core";
import { ColorButton } from "~components/dump";
import { Storage } from "~api";
import { GreetingScreen, RootScreenProps } from "~types";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";

const DMDIntro: RootScreenProps<"DMDIntro"> = ({ navigation }) => {
	const end = async () => {
		await Storage.setStatusShowGreetingScreen(GreetingScreen.DESCRIPTION_DMD);
		navigation.navigate("RelaxListForDMD");
	};

	useFocusEffect(
		useCallback(() => {
			StatusBar.setStatusBarTranslucent(true);
			StatusBar.setStatusBarStyle("light");
		}, [])
	);

	return (
		<View style={styles.background}>
			<StatusBar.StatusBar hidden />

			<Image source={require("./assets/professor.png")} style={styles.image} />
			<View style={styles.content}>
				<Text style={styles.title} adjustsFontSizeToFit>
					{i18n.t("cf6383b7-a22c-40c2-8c3f-0d107ea6d089")}
				</Text>
				<Text style={styles.text} adjustsFontSizeToFit>
					{i18n.t("0565784b-4add-4cec-9600-251ac3cee448")}
				</Text>
				<ColorButton styleButton={styles.button} styleText={styles.buttonText} onPress={() => end()}>
					{i18n.t("cbe3cadd-63a1-4295-99a3-d66bc332c399")}
				</ColorButton>
			</View>
		</View>
	);
};

export default DMDIntro;

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	image: {
		width: "100%",
		flex: 3,
	},
	content: {
		paddingHorizontal: 20,
		flex: 4,
	},
	title: {
		color: "#3D3D3D",
		fontFamily: "Inter_700Bold",
		fontSize: 32,
		width: "100%",
		maxHeight: 68,
	},
	text: {
		marginTop: 30,
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 16,
		width: "100%",
		...Core.gStyle.font("400"),
	},
	button: {
		backgroundColor: "rgba(194, 169, 206, 1)",
		borderRadius: 15,
		marginTop: 15,
	},
	buttonText: {
		color: "#FFFFFF",
	},
});
