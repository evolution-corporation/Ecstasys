/** @format */

import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";

import Tools from "~core";
import core from "~core";
import { TimeLine } from "~components/dump";

import { RootScreenProps } from "~types";
import i18n from "~i18n";

import { useDimensions } from "@react-native-community/hooks";
import useMeditation from "src/hooks/use-meditation";
import useTimer from "src/hooks/use-timer";
import useBackgroundSound from "src/hooks/use-background-sound";
import { useKeepAwake } from "expo-keep-awake";
import BackgroundSoundButton from "~components/dump/background-sound-button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAppSelector } from "~store";

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

	const [hiddenUI, setHiddenUI] = React.useState(false);

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

	const currentColor = useAppSelector(store => store.practice.colorDor as string);

	const [scaleDot, setScaleDot] = React.useState<number>(100);
	const [editView, setEditView] = React.useState<boolean>(false);

	useEffect(() => {
		navigation.setOptions({ headerShown: !hiddenUI });
	}, [hiddenUI]);

	return (
		<View style={styles.background}>
			<Pressable
				style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 28, justifyContent: "flex-end" }}
				onPress={() => setHiddenUI(prevState => !prevState)}
			>
				<View
					style={{
						width: window.width,
						height: window.height,
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
					}}
				>
					<Pressable>
						<View
							style={{
								backgroundColor: currentColor,
								width: scaleDot,
								height: scaleDot,
								borderRadius: 100,
							}}
						/>
					</Pressable>
				</View>
				{hiddenUI ? null : (
					<>
						<Animated.View
							style={{
								alignSelf: "center",
								width: window.width,
								height: window.height,
								alignItems: "center",
								justifyContent: "center",
								position: "absolute",
							}}
							entering={FadeIn}
							exiting={FadeOut}
						>
							<Pressable>
								<View style={styles.timesCodeBox}>
									<Text style={styles.timeCode} key={"current"}>
										{i18n.strftime(new Date(timer.currentMilliseconds), "%M:%S")}
									</Text>
								</View>
							</Pressable>
						</Animated.View>
						<Animated.View style={{ flexDirection: "row" }} entering={FadeIn} exiting={FadeOut}>
							<View style={{ flex: 1 }}>
								<Pressable>
									<TimeLine
										onChange={percent => {
											setScaleDot(20 + 150 * percent);
										}}
										initValue={(scaleDot - 40) / 80}
									/>
								</Pressable>
							</View>
							<Pressable
								style={{ width: 90, height: 41, borderRadius: 20.5, marginLeft: 30 }}
								onPress={() => {
									navigation.navigate("ChangeColorDot");
								}}
							>
								<Image source={require("assets/rgbButton.png")} style={{ width: "100%", height: "100%" }} />
							</Pressable>
						</Animated.View>
						<Animated.View style={{ alignSelf: "flex-start", marginTop: 17 }} entering={FadeIn} exiting={FadeOut}>
							<BackgroundSoundButton image={undefined} name={backgroundSound.name} />
						</Animated.View>
					</>
				)}
			</Pressable>
		</View>
	);
};

export default PlayerMeditationDot;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#000000",
		flex: 1,
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
