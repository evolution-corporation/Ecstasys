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
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import SelectColor from "src/components/SelectColor";
import { CustomModal } from "~components/containers";
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

const PlayerMeditationDot: RootScreenProps<"PlayerMeditationDot"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;
	const { window } = useDimensions();
	const [currentNameBackgroundSound, currentVolumeBackgroundSound] = useAppSelector(store => [
		store.practice.paramsPractice.currentNameBackgroundSound,
		store.practice.paramsPractice.currentVolumeBackgroundSound,
	]);
	const statusIsLoaded = useRef(true);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const _currentTime = useRef<number>(0);
	const audioVoice = useRef<Audio.Sound>(new Audio.Sound());

	const audioBackground = useRef<Audio.Sound | null>(null);

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
				.loadAsync({
					uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/baseSound/%D0%9C%D0%B5%D0%B4%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%9A%D0%BE%D0%BD%D1%86%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D1%82%D0%BE%D1%87%D0%BA%D0%B5%20no%20FX.mp3",
				})
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
			// StatusBar.setStatusBarTranslucent(true);
			// StatusBar.setStatusBarStyle("light");
		}, [])
	);
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
						<SelectColor size={250} widthBorder={30} onChange={c => setColor(c)} initColor={color} scaleDot={scaleDot}/>
						{window.height >= 800 ? (
							<ColorButton
								onPress={() => {
									setEditView(false);
								}}
								styleButton={{ paddingHorizontal: 25, borderRadius: 100, transform: [{ translateY: 100 }] }}
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
							{i18n.strftime(new Date(currentTime), "%M:%S")}
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
			<Pressable style={styles.buttonBackgroundSound} onPress={() => navigation.navigate("SelectBackgroundSound", {})}>
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
