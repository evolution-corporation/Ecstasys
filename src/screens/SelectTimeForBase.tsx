/** @format */

//! 50% Не работает нормально
//TODO: требуется рефракторинг

import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";

import { Dimensions, Image, StyleSheet, Switch, Text, View } from "react-native";
import { ColorButton, SelectTime, TextButton } from "~components/dump";

import gStyle from "~styles";
import i18n from "~i18n";

import { RootScreenProps } from "~types";
import { SharedElement } from "react-navigation-shared-element";
import * as StatusBar from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useDimensions } from "@react-native-community/hooks";

const SelectTimeForBase: RootScreenProps<"SelectTimeForBase"> = ({ navigation, route }) => {
	const { selectedPractice } = route.params;
	const selectTime = React.useRef<React.ElementRef<typeof SelectTime>>(null);
	const [milliseconds, setMilliseconds] = useState<number>(300000);
	const { window } = useDimensions();
	const heightHeaded = useHeaderHeight();
	const [isNeedVoice, setIsNeedVoice] = React.useState<boolean>(false);
	useFocusEffect(
		useCallback(() => {
			StatusBar.setStatusBarTranslucent(true);
			StatusBar.setStatusBarStyle("light");
			navigation.setOptions({
				title: selectedPractice.name,
			});
		}, [])
	);
	return (
		<View style={styles.background}>
			<StatusBar.StatusBar style="light" hidden={false} translucent backgroundColor={undefined} />
			<View style={{ flex: 1, width: "100%" }}>
				<View style={styles.topContent}>
					<SharedElement id={`practice.item.${selectedPractice.id}`} style={styles.image}>
						<Image source={selectedPractice.image} style={{ width: "100%", height: "100%" }} />
					</SharedElement>
					<View
						style={{
							height: 45,
							alignItems: "center",
							justifyContent: "space-between",
							flexDirection: "row",
							backgroundColor: "#C2A9CE",
							borderRadius: 15,
							paddingHorizontal: 9,
							width: window.width - 52,
							alignSelf: "center",
							bottom: -22.5,
							position: "absolute",
						}}
					>
						<Text style={{ color: "#FFFFFF", fontSize: 14, ...gStyle.font("500") }}>
							{i18n.t("4cfd0240-f282-4148-a991-4deff19e7028")}
						</Text>
						<Switch
							value={isNeedVoice}
							onValueChange={setIsNeedVoice}
							trackColor={{ false: "#9765A8", true: "#9765A8" }}
							thumbColor={"#FFFFFF"}
						/>
					</View>
				</View>
				<Text style={styles.mainText}>{i18n.t("0ca92b30-37c2-4604-a06f-f6f2da9e4985")} </Text>
			</View>
			<View style={{ width: window.width, height: 420, justifyContent: "flex-end", paddingHorizontal: 20 }}>
				<SelectTime
					ref={selectTime}
					start={[5, 0]}
					end={[90, 0]}
					style={{ alignSelf: "center" }}
					onChange={([minute, second]) => {
						setMilliseconds((minute * 60 + second) * 1000);
					}}
				/>
				<TextButton
					styleText={styles.resetDefault}
					onPress={() => {
						selectTime.current?.setTime(300000);
					}}
				>
					{i18n.t("d61edffc-4710-4707-9ddc-3576780004fc")}
				</TextButton>
				<ColorButton
					styleButton={styles.buttonView}
					styleText={styles.buttonText}
					onPress={() => {
						if (selectedPractice.id === "32c996f7-13e6-4604-966d-b96a8bf0e7c3") {
							navigation.navigate("PlayerMeditationOnTheMandala", { isNeedVoice, practiceLength: milliseconds });
						} else if (selectedPractice.id === "9ce4657e-2d0a-405a-b02f-408dd76cc8f7") {
							navigation.navigate("PlayerMeditationOnTheNose", { isNeedVoice, practiceLength: milliseconds });
						}
					}}
				>
					{i18n.t("c45a8d0b-dca1-46d8-8110-6fe268acabfd")}
				</ColorButton>
			</View>
		</View>
	);
};

export default SelectTimeForBase;

const styles = StyleSheet.create({
	background: {
		paddingBottom: 55,
		flex: 1,
	},
	image: {
		width: "100%",
		height: "100%",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		overflow: "hidden",
	},
	imageContent: {
		width: "100%",
		height: "100%",
		justifyContent: "flex-start",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
	},
	topContent: {
		width: "100%",
		left: 0,
		right: 0,
		...gStyle.shadows(2, 3),
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	mainText: {
		color: "#3D3D3D",
		fontSize: 15,
		...gStyle.font("400"),
		textAlign: "center",
		lineHeight: 17.58,
		width: 340,
		marginTop: 37,
		alignSelf: "center",
	},
	boldMainText: {
		...gStyle.font("600"),
	},
	buttonView: {
		backgroundColor: "#9765A8",
		borderRadius: 15,
		width: "100%",
	},
	buttonText: {
		color: "#FFFFFF",
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
