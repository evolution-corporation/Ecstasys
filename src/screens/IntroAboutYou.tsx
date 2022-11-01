/** @format */

import React from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";

import i18n from "~i18n";
import gStyle from "~styles";
import { RootScreenProps } from "~types";
import { TextButton } from "~components/dump";
import Chevron from "assets/icons/Chevron_Down.svg";
import ChevronViolet from "assets/icons/ChevronViolet.svg";

import Bird from "assets/BirdIntroSmall.svg";
import { useDimensions } from "@react-native-community/hooks";
import { StatusBar } from "expo-status-bar";

const IntroScreen: RootScreenProps<"IntroAboutYou"> = ({ navigation }) => {
	const [heightBird, setHeightBird] = React.useState<number | null>(null);
	const { window } = useDimensions();
	return (
		<View style={[styles.background]}>
			<StatusBar hidden />
			<Image
				source={require("assets/BirdIntro.png")}
				resizeMode={"contain"}
				style={{
					flex: 1,
					alignSelf: "center",
				}}
			/>
			<View
				style={styles.text}
				onLayout={({ nativeEvent: { layout } }) => {
					setHeightBird(window.height - layout.y);
				}}
			>
				<Text style={[styles.title]} adjustsFontSizeToFit>
					{i18n.t("4175a7b2-df02-4842-afe5-6146715a6db0")}
				</Text>
				<Text style={[styles.description]} adjustsFontSizeToFit onLayout={({ nativeEvent: { layout } }) => {}}>
					{i18n.t("d2959f34-68cc-43a2-b1f0-ffb8d429b418")}
				</Text>
				<View style={styles.menuButton}>
					<Pressable
						style={styles.prevScreen}
						onPress={() => {
							navigation.navigate("IntroAboutApp");
						}}
					>
						<Chevron />
					</Pressable>
					<Pressable
						style={styles.nextScreen}
						onPress={() => {
							navigation.navigate("SelectMethodAuthentication");
						}}
					>
						<ChevronViolet />
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
		// justifyContent: "space-between",
		backgroundColor: "#9765A8",
		alignItems: "center",
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
		maxHeight: 120,
		width: "100%",
		color: "#FFf",
	},
	description: {
		fontSize: 16,
		...gStyle.font("400"),
		color: "#Fff",
		opacity: 0.71,
		lineHeight: 22.4,
		marginVertical: 26,
		maxHeight: 145,
	},
	text: {
		marginTop: 30,
		paddingHorizontal: 20,
		marginBottom: 25,
		width: "100%",
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
		backgroundColor: "#FFf",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		width: 38,
		height: 38,
	},
	prevScreen: {
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		width: 38,
		height: 38,
		transform: [{ rotate: "90deg" }],
	},
});

export default IntroScreen;
