/** @format */

//! 50% Не работает нормально
//TODO: требуется рефракторинг

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";

import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native";
import { ColorButton } from "~components/dump";

import Core from "~core";
import { useMeditationContext } from "~modules/meditation";
import i18n from "~i18n";

import { ScrollTime } from "./components";

import type { MeditationPracticesScreenProps } from "src/routes";

const TimerPractices: MeditationPracticesScreenProps<"TimerPractices"> = ({ navigation }) => {
	const { meditation } = useMeditationContext();
	const [timeMilleseconds, setTimeMilleseconds] = useState<number>(Number(meditation.getLengthTime("milliseconds")));

	const setLength = () => {
		meditation.setLengthMeditation(timeMilleseconds);
		navigation.navigate("PlayerScreen");
	};
	const heightHeade = useHeaderHeight();

	return (
		<View style={styles.background}>
			<ImageBackground source={{ uri: meditation.image }} style={[styles.image, { paddingTop: heightHeade }]}>
				<LinearGradient style={styles.timeMinutesBox} colors={["#75348B", "#6A2382"]}>
					<Text style={styles.timeMinutes}>
						{Math.floor(timeMilleseconds / 60000) > 0
							? i18n.t("minute", {
									count: Math.floor(timeMilleseconds / 60000),
							  })
							: i18n.t("second", {
									count: Math.floor((timeMilleseconds % 60000) / 1000),
							  })}
						{}
					</Text>
				</LinearGradient>
			</ImageBackground>
			<Text style={styles.mainText}>
				{i18n.t("e233a33c-3f87-4695-b7ac-29d57ff11ad2")}{" "}
				{/* <Text style={styles.boldMainText}>
          {i18n.t("399ca325-5376-44e1-8767-f07451e209e8")}
        </Text> */}
			</Text>
			<ScrollTime
				onChange={time => {
					setTimeMilleseconds((time.minutes * 60 + time.seconds) * 1000);
				}}
				minimalTime={Number(meditation.getLengthTime("milliseconds"))}
			/>
			<View style={{ width: "100%" }}>
				<ColorButton
					styleButton={styles.buttonView}
					styleText={styles.buttonText}
					onPress={() => {
						setLength();
					}}
				>
					{i18n.t("c45a8d0b-dca1-46d8-8110-6fe268acabfd")}
				</ColorButton>
			</View>
		</View>
	);
};

export default TimerPractices;

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
		paddingBottom: 55,
		alignItems: "center",
		flex: 1,
	},
	image: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height / 2.2,
		...Core.gStyle.shadows(2, 3),
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		overflow: "hidden",
	},
	mainText: {
		marginTop: 18,
		color: "#3D3D3D",
		fontSize: 15,
		...Core.gStyle.font("400"),
		textAlign: "center",
		lineHeight: 17.58,
		width: 340,
	},
	boldMainText: {
		...Core.gStyle.font("600"),
	},
	buttonView: {
		backgroundColor: "#9765A8",
		borderRadius: 15,
	},
	buttonText: {
		color: "#FFFFFF",
		textAlign: "center",
	},
	timeMinutes: {
		color: "#FFFFFF",
		fontSize: 14,
		...Core.gStyle.font("600"),
	},
	timeMinutesBox: {
		borderRadius: 15,
		paddingHorizontal: 34,
		height: 30,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
	},
});
