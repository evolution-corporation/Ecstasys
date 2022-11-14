/** @format */

import React from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";

import i18n from "~i18n";
import gStyle from "~styles";
import { RootScreenProps } from "~types";
import { StatusBar } from "expo-status-bar";

import { TextButton } from "~components/dump";
import Chevron from "assets/icons/Chevron_Down.svg";

const IntroScreen: RootScreenProps<"IntroAboutApp"> = ({ navigation }) => {
	return (
		<View style={[styles.background]}>
			<StatusBar hidden />
			<Image
				source={require("assets/professorNoHaveFoot.png")}
				resizeMode={"contain"}
				style={{
					flex: 1,
					alignSelf: "center",
				}}
			/>
			<View style={styles.text}>
				<Text style={[styles.title]} adjustsFontSizeToFit>
					{i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
					<Text style={{ color: "#9765A8", fontFamily: "Inter_700Bold" }}>{"\n"}DMD Meditation!</Text>
				</Text>
				<Text style={[styles.description]} adjustsFontSizeToFit onLayout={({ nativeEvent: { layout } }) => {}}>
					{i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29")}
				</Text>
				<View style={styles.menuButton}>
					<TextButton
						onPress={() => {
							navigation.navigate("SelectMethodAuthentication");
						}}
						styleText={styles.skipButton}
					>
						{i18n.t("skip")}
					</TextButton>
					<Pressable
						style={styles.nextScreen}
						onPress={() => {
							navigation.navigate("IntroAboutYou");
						}}
					>
						<Chevron />
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		paddingVertical: 25,
		justifyContent: "flex-end",
		backgroundColor: "#FFFFFF",
	},
	professor: {
		position: "absolute",
		zIndex: 200,
		alignSelf: "center",
		top: -25,
	},
	title: {
		textAlign: "left",
		fontFamily: "Inter_700Bold",
		fontWeight: "700",
		fontSize: 32,
		maxHeight: 100,
		width: "100%",
	},
	description: {
		fontSize: 16,
		...gStyle.font("400"),
		color: "#404040",
		opacity: 0.71,
		lineHeight: 22.4,
		marginVertical: 26,
		maxHeight: 136,
	},
	text: {
		flex: 0,
		marginTop: 30,
		paddingHorizontal: 20,
		marginBottom: 25,
		fontFamily: "Inter_700Bold",
	},
	skipButton: {
		fontSize: 14,
		opacity: 1,
		color: "rgba(194, 169, 206, 1)",
	},
	menuButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	nextScreen: {
		backgroundColor: "rgba(151, 101, 168, 1)",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		width: 38,
		height: 38,
		transform: [{ rotate: "-90deg" }],
	},
});

export default IntroScreen;
