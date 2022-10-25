/** @format */

//! 50% Не работает нормально
//TODO: требуется рефракторинг

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ColorButton, SelectTime, TextButton } from "~components/dump";

import gStyle from "~styles";
import i18n from "~i18n";

import { RootScreenProps } from "~types";
import { SharedElement } from "react-navigation-shared-element";

const SelectTimeForRelax: RootScreenProps<"SelectTimeForRelax"> = ({ navigation, route }) => {
	const { selectedPractice } = route.params;
	const selectTime = React.useRef<React.ElementRef<typeof SelectTime>>(null);
	const [milliseconds, setMilliseconds] = useState<number>(selectedPractice.length);
	console.log(selectedPractice);
	const heightHeaded = useHeaderHeight();

	return (
		<View style={styles.background}>
			<View style={styles.topBlock}>
				<View style={styles.topContent}>
					<SharedElement id={`practice.item.${selectedPractice.id}`} style={styles.image}>
						<Image source={{ uri: selectedPractice.image }} style={{ width: "100%", height: "100%" }} />
					</SharedElement>
					<View style={[styles.imageContent, { paddingTop: heightHeaded }]}>
						<LinearGradient style={styles.timeMinutesBox} colors={["#75348B", "#6A2382"]}>
							<Text style={styles.timeMinutes}>
								{i18n.t("minute", {
									count: Math.floor(milliseconds / 60000),
								})}
							</Text>
						</LinearGradient>
					</View>
				</View>
				<Text style={styles.mainText}>
					{i18n.t("e233a33c-3f87-4695-b7ac-29d57ff11ad2")}{" "}
					<Text style={styles.boldMainText}>{i18n.t("399ca325-5376-44e1-8767-f07451e209e8")}</Text>
				</Text>
			</View>
			<SelectTime
				ref={selectTime}
				start={[Math.floor(selectedPractice.length / 60000), Math.floor((selectedPractice.length % 60000) / 1000)]}
				end={[25, 0]}
				style={{ height: 200 }}
				onChange={([minute, second]) => {
					setMilliseconds((minute * 60 + second) * 1000);
				}}
			/>
			<View style={styles.bottomBlock}>
				<TextButton
					styleText={styles.resetDefault}
					onPress={() => {
						selectTime.current?.setTime(selectedPractice.length);
					}}
				>
					{i18n.t("d61edffc-4710-4707-9ddc-3576780004fc")}
				</TextButton>
				<View style={{ width: "100%" }}>
					<ColorButton
						styleButton={styles.buttonView}
						styleText={styles.buttonText}
						onPress={() => {
							navigation.navigate("PlayerForPractice", { selectedPractice, practiceLength: milliseconds });
						}}
					>
						{i18n.t("c45a8d0b-dca1-46d8-8110-6fe268acabfd")}
					</ColorButton>
				</View>
			</View>
		</View>
	);
};

export default SelectTimeForRelax;

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
		paddingBottom: 55,
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	topBlock: {
		left: 0,
		right: 0,
		width: Dimensions.get("window").width,
		alignItems: "center",
	},
	bottomBlock: {
		width: "100%",
		justifyContent: "space-between",
	},
	image: {
		width: "100%",
		height: "100%",
		position: "absolute",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	imageContent: {
		width: "100%",
		height: "100%",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	topContent: {
		width: "100%",
		height: Dimensions.get("screen").height / 3,
		left: 0,
		right: 0,
		...gStyle.shadows(2, 3),
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		overflow: "hidden",
	},
	mainText: {
		marginTop: 18,
		color: "#3D3D3D",
		fontSize: 15,
		...gStyle.font("400"),
		textAlign: "center",
		lineHeight: 17.58,
		width: 340,
	},
	boldMainText: {
		...gStyle.font("600"),
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
		...gStyle.font("600"),
	},
	timeMinutesBox: {
		borderRadius: 15,
		paddingHorizontal: 34,
		height: 30,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
	},
	resetDefault: {
		color: "#C2A9CE",
		fontSize: 12,
		...gStyle.font("500"),
		marginBottom: 10,
	},
});
