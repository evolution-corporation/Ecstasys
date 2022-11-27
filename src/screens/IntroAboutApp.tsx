/** @format */

import React from "react";
import { StyleSheet, Text, Image, View, Pressable, Dimensions } from "react-native";

import i18n from "~i18n";
import gStyle from "~styles";
import { RootScreenProps } from "~types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screen } from "~components/containers";

import Chevron from "assets/icons/Chevron_Down.svg";
import { useDimensions } from "@react-native-community/hooks";

const IntroScreen: RootScreenProps<"IntroAboutApp"> = ({ navigation }) => {
	const { window } = useDimensions();
	return (
		<Screen backgroundColor={"#FFFFFF"} styleScreen={{ justifyContent: "flex-end", paddingBottom: 65 }} headerHidden>
			<View
				style={{
					flex: 1,
					bottom: 0,
					width: window.width,
					justifyContent: "flex-end",
				}}
			>
				<Image
					source={require("assets/professorNoHaveFoot.png")}
					resizeMode={"contain"}
					style={{
						width: "180%",
						height: "90%",
						bottom: 0,
						left: "-21.5%",
					}}
				/>
			</View>
			<Text style={{ ...gStyle.styles.Title, color: "#3D3D3D" }}>
				{i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
				{"\n"}
				<Text style={[{ color: "#9765A8" }]} onTextLayout={({ nativeEvent: { lines } }) => console.log(lines)}>
					dmd meditation!
				</Text>
			</Text>

			<Text style={{ ...gStyle.styles.Description, color: "#404040", marginVertical: 20 }}>
				{i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29")}
			</Text>
			<View style={styles.menuButton}>
				<Text
					onPress={() => {
						navigation.navigate("SelectMethodAuthentication");
					}}
					style={styles.skipButton}
				>
					{i18n.t("skip")}
				</Text>
				<Pressable
					style={styles.nextScreen}
					onPress={() => {
						navigation.navigate("IntroAboutYou");
					}}
				>
					<Chevron />
				</Pressable>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	skipButton: {
		fontSize: 16,
		opacity: 1,
		...gStyle.font("400"),
		color: "rgba(194, 169, 206, 1)",
	},
	menuButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 50,
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
