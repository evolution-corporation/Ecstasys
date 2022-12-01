/** @format */

import React, { ElementRef, useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, Button, Pressable, Dimensions } from "react-native";
import Animated, { FadeIn, FadeOut, runOnJS } from "react-native-reanimated";
import Swiper from "react-native-swiper";
import i18n from "~i18n";

import { ColorButton, TextButton } from "~components/dump";

import useAnimation from "./animation";
import Arrow from "./assets/Arrow.svg";
import ArrowLeft from "./assets/arrowLeft.svg";
import gStyle from "~styles";
import { GreetingScreen, RootScreenProps } from "~types";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import { Storage } from "~api";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";

const swiperContent = [
	{
		name: "relaxation",
		title: "0af6a319-a325-44d1-a454-5f3e1133d3f4",
		text: "7b205d68-98a8-4f07-8a4c-347fe65a0961",
		image: require("./assets/relax.png"),
	},
	{
		name: "visualizations",
		title: "6b062117-66f9-4d99-a609-e0eafc69d42f",
		text: "0808c3b7-8eda-403a-8b7d-515aa50c7723",
		image: require("./assets/Visualizations.png"),
	},
	// {
	// 	name: "breath",
	// 	title: "6c54f2fa-93eb-495c-a51b-039aee5cfcd1",
	// 	text: "0894c96e-83bf-4c27-b498-c3d6b51251b5",
	// 	image: require("./assets/breath.png"),
	// },
	{
		name: "base",
		title: "48832a25-622d-4251-b147-ea6ebd134632",
		text: "4cb7de64-0c26-4200-af9d-0e2cb533760c",
		image: require("./assets/base.png"),
	},
	{
		name: "dmd",
		title: "385cfdf2-c360-404a-8618-cb65583957c0",
		text: "d810ec3c-1d46-48b3-ba30-45e135dcad44",
		image: require("./assets/dmd.png"),
	},
];

const IntroPracticesScreen: RootScreenProps<"IntroPractices"> = ({ navigation }) => {
	const [isGreeting, setIsGreeting] = useState<boolean>(true);

	const [indexSelect, setSelectedIndex] = React.useState<number>(0);
	useFocusEffect(
		useCallback(() => {
			// StatusBar.setStatusBarHidden(true, "none");
		}, [])
	);

	const end = async () => {
		await Storage.setStatusShowGreetingScreen(GreetingScreen.DESCRIPTION_PRACTICES);
		navigation.navigate("PracticesList");
	};

	const next = () => {
		if (isGreeting) {
			setIsGreeting(false);
		} else if (indexSelect < swiperContent.length - 1) {
			setSelectedIndex(prev => prev + 1);
		} else {
			end();
		}
	};

	const prev = () => {
		if (indexSelect > 0) {
			setSelectedIndex(prev => prev - 1);
		} else {
			setIsGreeting(true);
		}
	};

	const gesture = Gesture.Pan()
		.onChange(({}) => {})
		.onFinalize(({ translationX }) => {
			if (translationX > 0) {
				runOnJS(prev)();
			} else if (translationX < 0) {
				runOnJS(next)();
			}
		});

	return (
		<View style={styles.background}>
			{isGreeting ? null : (
				<Image
					source={require("./assets/Vector403.png")}
					style={{
						position: "absolute",
						width: Dimensions.get("window").width,
						bottom: 0,
						height: (795 / 1125) * Dimensions.get("window").width,
					}}
					resizeMode={"contain"}
				/>
			)}
			{isGreeting ? (
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<Image source={require("./assets/BirdProfessor.png")} style={{ width: "100%", height: "100%" }} />
					</View>
					<Text style={styles.title}>{i18n.t("3410ac11-a61b-49f7-b7e4-3bbc2998f1c2")}</Text>
					<Text style={styles.text}>{i18n.t("42ccdb27-d3ef-4a77-89bf-89138155211e")}</Text>
				</View>
			) : (
				<GestureDetector gesture={gesture}>
					<View style={{ justifyContent: "space-between", flex: 1, marginBottom: "30%" }}>
						{
							swiperContent.map(item => (
								<Animated.View key={item.name} style={styles.card} entering={FadeIn} exiting={FadeOut}>
									<View style={{ width: "100%", maxHeight: "60%" }}>
										<Image source={item.image} style={styles.logoCategory} resizeMode={"contain"} />
									</View>
									<Text style={[styles.titleCategory]}>{i18n.t(item.title)}</Text>
									<Text style={styles.textCategory}>{i18n.t(item.text)}</Text>
								</Animated.View>
							))[indexSelect]
						}
						<Svg
							height={9}
							width={swiperContent.length * 9 + (swiperContent.length - 1) * 9}
							style={{ alignSelf: "center" }}
						>
							{new Array(swiperContent.length).fill(null).map((_, index) => (
								<Circle
									r={4.5}
									fill={indexSelect === index ? "red" : "rgba(231, 221, 236, 1)"}
									x={4.5 + index * 18}
									y={4.5}
									key={`${index}_key`}
								/>
							))}
						</Svg>
					</View>
				</GestureDetector>
			)}

			<View style={styles.buttonControl}>
				{isGreeting ? (
					<TextButton onPress={() => end()}>{i18n.t("skip")}</TextButton>
				) : (
					<Pressable
						style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}
						onPress={() => {
							if (indexSelect > 0) {
								setSelectedIndex(prev => prev - 1);
							} else {
								setIsGreeting(true);
							}
						}}
					>
						<ArrowLeft />
					</Pressable>
				)}
				<ColorButton
					secondItem={<Arrow />}
					styleButton={styles.buttonNext}
					onPress={() => {
						if (isGreeting) {
							setIsGreeting(false);
						} else if (indexSelect < swiperContent.length - 1) {
							setSelectedIndex(prev => prev + 1);
						} else {
							end();
						}
					}}
				/>
			</View>
		</View>
	);
};

export default IntroPracticesScreen;

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "space-between",
		// paddingHorizontal: 20,
		paddingBottom: 50,
		backgroundColor: "#FFFFFF",
	},
	birdProffessor: {
		position: "absolute",
		left: 0,
		bottom: 0,
	},
	title: {
		color: "#3D3D3D",
		fontSize: 32,
		fontFamily: "Inter_700Bold",
		marginHorizontal: 20,
	},
	text: {
		color: "#3d3d3d",
		marginHorizontal: 20,
		fontSize: 16.5,
		lineHeight: 23.1,
		...gStyle.font("400"),
		marginTop: 20,
	},
	buttonControl: {
		flexDirection: "row",
		width: "100%",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 20,
		paddingHorizontal: 20,
	},
	buttonNext: {
		backgroundColor: "#9765A8",
		width: 38,
		height: 38,
		borderRadius: 10,
	},
	logoCategory: {
		width: "100%",
		height: "100%",
	},
	card: {
		alignItems: "center",
	},
	titleCategory: {
		color: "#3D3D3D",
		fontSize: 24,
		fontFamily: "Inter_700Bold",
		marginVertical: 16,
		textAlign: "center",
	},
	textCategory: {
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 16,
		lineHeight: 22,
		...gStyle.font("400"),
		textAlign: "center",
		marginHorizontal: 20,
		backgroundColor: "red",
	},
});
