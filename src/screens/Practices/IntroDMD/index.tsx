/** @format */

import { StyleSheet, Text, View, Image, Pressable, Platform, Dimensions } from "react-native";
import React, { useCallback } from "react";
import i18n from "~i18n";

import Core from "~core";
import { ColorButton } from "~components/dump";
import { Storage } from "~api";
import { GreetingScreen, RootScreenProps } from "~types";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import Close from "assets/Menu/Close_MD.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DMDIntro: RootScreenProps<"DMDIntro"> = ({ navigation }) => {
	const end = async () => {
		await Storage.setStatusShowGreetingScreen(GreetingScreen.DESCRIPTION_DMD);
		navigation.navigate("RelaxListForDMD");
	};

	useFocusEffect(
		useCallback(() => {
			// StatusBar.setStatusBarHidden(true, "none");
		}, [])
	);
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.background, { paddingBottom: 20 + insets.bottom }]}>
			<Image source={require("assets/Group480955621.png")} style={styles.image} />
			<View style={styles.content}>
				<Text style={styles.title}>{i18n.t("cf6383b7-a22c-40c2-8c3f-0d107ea6d089")}</Text>
				<Text
					style={[styles.text, Platform.OS === "android" ? { maxHeight: "50%" } : null]}
					adjustsFontSizeToFit={Platform.OS === "android"}
				>
					{i18n.t("0565784b-4add-4cec-9600-251ac3cee448")}
				</Text>

				<ColorButton styleButton={styles.button} styleText={styles.buttonText} onPress={() => end()}>
					{i18n.t("cbe3cadd-63a1-4295-99a3-d66bc332c399")}
				</ColorButton>
			</View>
			<Pressable style={{ position: "absolute", right: 12, top: 43 }} onPress={() => end()}>
				<Close />
			</Pressable>
		</View>
	);
};

export default DMDIntro;

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "space-between",
	},
	image: {
		width: "100%",
		flex: 1,
	},
	content: {
		// flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: 20,
	},
	title: {
		color: "#3D3D3D",
		fontFamily: "Inter_700Bold",
		fontSize: 32,
		width: "100%",
	},
	text: {
		marginTop: 30,
		color: "#404040",
		fontSize: 16.5,
		width: "100%",
		...Core.gStyle.font("400"),
	},
	button: {
		backgroundColor: "rgba(194, 169, 206, 1)",
		borderRadius: 15,
		marginTop: 30,
	},
	buttonText: {
		color: "#FFFFFF",
	},
});
