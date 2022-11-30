/** @format */

import React, { useCallback, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, FlatList, Pressable, ImageSourcePropType } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import * as Notifications from "expo-notifications";

import Tools from "~core";
import { ColorButton } from "~components/dump";

import { RootScreenProps } from "~types";
import BackgroundSound from "src/backgroundSound";
import i18n from "~i18n";

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import core from "~core";
import { initializationTimer } from "src/TaskManager";
import Headphones from "assets/icons/Headphones_white.svg";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import * as BasePractice from "src/baseMeditation";
import { useDimensions } from "@react-native-community/hooks";
import { SharedElement } from "react-navigation-shared-element";

enum StatusPractice {
	Loading,
	Play,
	Pause,
	Change,
}

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

const PlayerMeditationOnTheNose: RootScreenProps<"PlayerMeditationOnTheNose"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;
	const [currentNameBackgroundSound, currentVolumeBackgroundSound] = useAppSelector(store => [
		store.practice.paramsPractice.currentNameBackgroundSound,
		store.practice.paramsPractice.currentVolumeBackgroundSound,
	]);
	const statusIsLoaded = useRef(true);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const _currentTime = useRef<number>(0);

	const audioBackground = useRef<Audio.Sound | null>(null);
	const audioVoice = useRef<Audio.Sound>(new Audio.Sound());

	const [isShowTime, setIsShowTime] = React.useState(true);
	const timerTask = React.useRef<ReturnType<typeof initializationTimer> | null>(null);
	const appDispatch = useAppDispatch();

	const [startTimer, stopTimer] = React.useRef([
		() => {
			timerTask.current = initializationTimer(() => {
				setCurrentTime(prevCurrentTime => {
					if (prevCurrentTime + 100 > practiceLength) {
						stopTimer();
					}
					_currentTime.current += 100;
					return prevCurrentTime + 100;
				});
			});
		},
		() => {
			if (timerTask.current !== null) timerTask.current();
		},
	]).current;

	useEffect(() => {
		Audio.setAudioModeAsync({
			staysActiveInBackground: false,
			interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
			interruptionModeIOS: InterruptionModeIOS.DoNotMix,
		});
		if (isNeedVoice && statusIsLoaded.current) {
			audioVoice.current
				.loadAsync(require("assets/BaseMeditaionAssets/Audio/01a14e9b-d185-43a7-a4a9-93331efee380.mp3"))
				.then(() => {
					statusIsLoaded.current = false;
					startTimer();
					audioVoice.current.playAsync();
				});
		} else if (!isNeedVoice) {
			startTimer();
		}

		return () => {
			if (audioBackground.current !== null) {
				audioBackground.current.getStatusAsync().then(status => {
					if (audioBackground.current !== null && status.isLoaded) audioBackground.current.stopAsync();
				});
			}
			stopTimer();
			audioVoice.current.stopAsync();
		};
	}, []);

	const setBackgroundSound = React.useCallback(
		async (name: keyof typeof BackgroundSound, volume: number = 1) => {
			if (name) {
				if (audioBackground.current !== null && (await audioBackground.current.getStatusAsync()).isLoaded) {
					await audioBackground.current.stopAsync();
				}
				audioBackground.current = (
					await Audio.Sound.createAsync(BackgroundSound[name].audio, {
						isLooping: true,
						volume,
						shouldPlay: true,
					})
				).sound;
			}
		},
		[currentTime]
	);

	const removeBackgroundSound = React.useCallback(async () => {
		if (audioBackground.current !== null && (await audioBackground.current.getStatusAsync()).isLoaded) {
			await audioBackground.current.stopAsync();
		}
	}, []);

	const rotateMandala = useSharedValue("0deg");

	const styleMandala = useAnimatedStyle(() => ({
		transform: [{ rotate: rotateMandala.value }],
		position: "absolute",
		width: "100%",
		height: "100%",
	}));

	useEffect(() => {
		if (currentNameBackgroundSound) {
			setBackgroundSound(currentNameBackgroundSound);
		} else {
			removeBackgroundSound();
		}
	}, [currentNameBackgroundSound]);

	useEffect(() => {
		audioBackground.current?.setVolumeAsync(currentVolumeBackgroundSound);
	}, [currentVolumeBackgroundSound]);

	useFocusEffect(
		useCallback(() => {
			StatusBar.setStatusBarTranslucent(true);
			StatusBar.setStatusBarStyle("light");
		}, [])
	);
	const { window } = useDimensions();
	return (
		<View style={styles.background}>
			<SharedElement id={"image"} style={{ width: "100%", height: "100%", position: "absolute" }}>
				<Image source={require("assets/BaseMeditationImage/Nose.png")} style={{ width: "100%", height: "100%" }} />
			</SharedElement>
			<View style={{ flex: 1, paddingHorizontal: 20 }}>
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
					{isShowTime && (
						<View style={styles.timesCodeBox}>
							<Text style={styles.timeCode} key={"current"}>
								{i18n.strftime(new Date(currentTime), "%M:%S")}
							</Text>
						</View>
					)}
				</Pressable>
				<View style={[styles.timeInfoBox]}>
					<Pressable
						style={styles.buttonBackgroundSound}
						onPress={() => navigation.navigate("SelectBackgroundSound", {})}
					>
						<Headphones style={{ marginRight: 24 }} />
						<Text style={styles.buttonBackgroundText}>
							{i18n.t(
								currentNameBackgroundSound !== null
									? BackgroundSound[currentNameBackgroundSound].translate
									: "12ee6d3a-ad58-4c4a-9b87-63645efe9c90"
							)}
						</Text>
					</Pressable>
				</View>
			</View>
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
