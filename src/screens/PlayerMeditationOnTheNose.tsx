/** @format */

import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useKeepAwake } from "expo-keep-awake";

import Tools from "~core";
import core from "~core";

import { RootScreenProps } from "~types";
import i18n from "~i18n";

import { useDimensions } from "@react-native-community/hooks";
import { SharedElement } from "react-navigation-shared-element";
import useTimer from "src/hooks/use-timer";
import useMeditation from "src/hooks/use-meditation";
import useBackgroundSound from "src/hooks/use-background-sound";
import BackgroundSoundButton from "~components/dump/background-sound-button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

const PlayerMeditationOnTheNose: RootScreenProps<"PlayerMeditationOnTheNose"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;

	const [hiddenUI, setHiddenUI] = React.useState(false);

	const timer = useTimer(practiceLength, () => navigation.navigate("EndMeditation"));

	const meditation = isNeedVoice
		? useMeditation(
				[
					{
						uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/baseSound/01a14e9b-d185-43a7-a4a9-93331efee380",
					},
				],
				timer.currentMilliseconds,
				{ autoPlay: true }
		  )
		: undefined;

	useEffect(() => {
		timer.play();
	}, []);

	const backgroundSound = useBackgroundSound(true);
	useKeepAwake();

	const { window } = useDimensions();

	useEffect(() => {
		navigation.setOptions({
			headerShown: !hiddenUI,
		});
	}, [hiddenUI]);

	return (
		<View style={styles.background}>
			<SharedElement id={"image"} style={{ width: "100%", height: "100%", position: "absolute" }}>
				<Image source={require("assets/BaseMeditationImage/Nose.png")} style={{ width: "100%", height: "100%" }} />
			</SharedElement>
			<Pressable style={{ flex: 1, paddingHorizontal: 20 }} onPress={() => setHiddenUI(prevState => !prevState)}>
				{hiddenUI ? null : (
					<>
						<Animated.View
							style={{
								alignSelf: "center",
								width: window.width - 40,
								height: window.width - 40,
								alignItems: "center",
								justifyContent: "center",
								position: "absolute",
								bottom: "40%",
							}}
							entering={FadeIn}
							exiting={FadeOut}
						>
							<View style={styles.timesCodeBox}>
								<Text style={styles.timeCode} key={"current"}>
									{i18n.strftime(new Date(timer.currentMilliseconds), "%M:%S")}
								</Text>
							</View>
						</Animated.View>
						<Animated.View style={[styles.timeInfoBox]} entering={FadeIn} exiting={FadeOut}>
							<BackgroundSoundButton image={undefined} name={backgroundSound.name} />
						</Animated.View>
					</>
				)}
			</Pressable>
		</View>
	);
};

export default PlayerMeditationOnTheNose;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#000000",
		flex: 1,
		justifyContent: "space-between",
		// paddingHorizontal: 20,
		width: "100%",
		height: "100%",
		position: "absolute",
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
