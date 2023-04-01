/** @format */

import React, { useCallback, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, FlatList, Pressable, ColorValue } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import * as Notifications from "expo-notifications";

import Tools from "~core";
import { ColorButton, TimeLine } from "~components/dump";

import { RootScreenProps } from "~types";
import BackgroundSound from "src/backgroundSound";
import i18n from "~i18n";
import gStyle from "~styles";
import core from "~core";
import Headphones from "assets/icons/Headphones_white.svg";

import { useDimensions } from "@react-native-community/hooks";

import SelectColor from "src/components/SelectColor";
import useMeditation from "src/hooks/use-meditation";
import useTimer from "src/hooks/use-timer";
import useBackgroundSound from "src/hooks/use-background-sound";
import { useKeepAwake } from "expo-keep-awake";
import BackgroundSoundButton from "~components/dump/background-sound-button";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

const PlayerMeditationDot: RootScreenProps<"PlayerMeditationDot"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;
	const { window } = useDimensions();

	const [isShowTime, setIsShowTime] = React.useState(true);

	const timer = useTimer(practiceLength, () => navigation.navigate("EndMeditation"));

	const meditation = isNeedVoice
		? useMeditation(
				[
					{
						uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/baseSound/%D0%9C%D0%B5%D0%B4%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%9A%D0%BE%D0%BD%D1%86%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D1%82%D0%BE%D1%87%D0%BA%D0%B5%20no%20FX",
					},
				],
				timer.currentMilliseconds,
				{ autoPlay: true }
		  )
		: undefined;

	const backgroundSound = useBackgroundSound(true);
	useKeepAwake();

	useEffect(() => {
		if (meditation !== undefined) {
			meditation.play();
		}
	}, [meditation]);

	useEffect(() => {
		timer.play();
	}, []);

	const [color, setColor] = React.useState<ColorValue>("rgb(134, 201, 39)");
	const [scaleDot, setScaleDot] = React.useState<number>(100);
	const [editView, setEditView] = React.useState<boolean>(false);

	return (
		<View style={styles.background}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				{editView ? (
					<>
						<Text style={{ color: "#FFF", fontSize: 20, ...gStyle.font("700"), marginBottom: 24 }}>
							{i18n.t("0ead63ec-a460-4688-9096-7310f2a10ed6")}
						</Text>
						<SelectColor
							size={250}
							widthBorder={30}
							onChange={c => setColor(c)}
							initColor={color}
							scaleDot={scaleDot}
						/>
						{window.height >= 800 ? (
							<ColorButton
								onPress={() => {
									setEditView(false);
								}}
								styleButton={{ paddingHorizontal: 25, borderRadius: 15, transform: [{ translateY: 100 }] }}
							>
								{i18n.t("save")}
							</ColorButton>
						) : null}
					</>
				) : (
					<View
						style={{
							backgroundColor: color,
							width: scaleDot,
							height: scaleDot,
							borderRadius: 100,
						}}
					/>
				)}
			</View>
			<Pressable
				onPress={() => setIsShowTime(prevState => !prevState)}
				style={{
					alignSelf: "center",
					width: window.width - 40,
					height: window.width - 40,
					alignItems: "center",
					justifyContent: "center",
					position: "absolute",
					bottom: "40%",
				}}
			>
				{isShowTime && !editView && (
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{i18n.strftime(new Date(timer.currentMilliseconds), "%M:%S")}
						</Text>
					</View>
				)}
			</Pressable>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1 }}>
					<TimeLine
						onChange={percent => {
							setScaleDot(40 + 80 * percent);
						}}
						initValue={(scaleDot - 40) / 80}
					/>
				</View>
				<Pressable
					style={{ width: 90, height: 41, borderRadius: 20.5, marginLeft: 30 }}
					onPress={() => {
						setEditView(prevValue => !prevValue);
					}}
				>
					<Image source={require("assets/rgbButton.png")} style={{ width: "100%", height: "100%" }} />
				</Pressable>
			</View>
			<View style={{ alignSelf: "flex-start", marginTop: 17 }}>
				<BackgroundSoundButton image={undefined} name={backgroundSound.name} />
			</View>
		</View>
	);
};

export default PlayerMeditationDot;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#000000",
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: 20,
		width: "100%",
		height: "100%",
		position: "absolute",
		paddingBottom: 37,
	},
	imageBackground: {
		width: "100%",
		height: "100%",
	},
	timeInfoBox: {
		width: "100%",
		position: "absolute",
		alignSelf: "center",
		bottom: 28,
		alignItems: "flex-start",
	},
	timesCodeBox: {
		width: 196,
		height: 196,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 98,
		backgroundColor: "rgba(61, 61, 61, 0.5)",
	},
	timeCode: {
		fontSize: 48,
		color: "#FFFFFF",
		...Tools.gStyle.font("400"),
	},
	buttonBackgroundSound: {
		alignSelf: "flex-start",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		paddingRight: 33,
		paddingLeft: 13,
		height: 50,
		borderRadius: 25,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 17,
	},
	buttonBackgroundText: {
		color: "#FFFFFF",
	},
	buttonControl: {
		backgroundColor: "rgba(61, 61, 61, 0.5)",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 11.5,
	},
	centerButtonControl: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	buttonSmall: {
		width: 41,
		height: 41,
		borderRadius: 20.5,
		justifyContent: "flex-end",
		padding: 8,
	},
	arrowControl: {
		position: "absolute",
		top: 7,
	},
	panelControl: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	textJumpTime: {
		color: "#FFFFFF",
		fontSize: 13,
		...core.gStyle.font("400"),
	},
	panelControlContainer: {
		alignSelf: "center",
		position: "absolute",
		width: "100%",
		top: "50%",
	},
});
