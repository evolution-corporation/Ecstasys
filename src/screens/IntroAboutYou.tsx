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
import { Screen } from "~components/containers";

const IntroScreen: RootScreenProps<"IntroAboutYou"> = ({ navigation }) => {
	return (
		<Screen backgroundColor={"#9765A8"} styleScreen={{ justifyContent: "flex-end", paddingBottom: 45 }} headerHidden>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Image
					source={require("assets/BirdIntro.png")}
					resizeMode={"contain"}
					style={{
						height: "70%",
						alignSelf: "center",
					}}
				/>
			</View>
			<Text style={{ ...gStyle.styles.title, color: "#FFFFFF" }}>{i18n.t("4175a7b2-df02-4842-afe5-6146715a6db0")}</Text>
			<Text style={{ ...gStyle.styles.description, color: "#E7DDEC", marginVertical: 20 }}>
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
		</Screen>
	);
};

const styles = StyleSheet.create({
	skipButton: {
		fontSize: 14,
		opacity: 1,
		color: "rgba(194, 169, 206, 1)",
	},
	menuButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 50,
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
