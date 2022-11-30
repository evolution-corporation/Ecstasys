/** @format */

import React, { useCallback, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, AppState, ActivityIndicator, Platform, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import * as Notifications from "expo-notifications";

import Tools from "~core";
import { TimeLine, PlayerControl, ColorButton, IsFavorite } from "~components/dump";

import { RootScreenProps } from "~types";
import BackgroundSound from "src/backgroundSound";
import i18n from "~i18n";

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import core from "~core";
import { initializationTimer } from "src/TaskManager";
import Headphones from "assets/icons/Headphones_white.svg";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { SharedElement } from "react-navigation-shared-element";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";

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

const PlayerForRelaxation: RootScreenProps<"PlayerForRelaxation"> = ({ navigation, route }) => {
	const { selectedPractice, practiceLength } = route.params;
	const practiceState = useAppSelector(store => {
		if (store.practice.currentPractice === undefined) throw new Error("Not Found Practice");
		return store.practice.currentPractice;
	});
	const { currentNameBackgroundSound, currentVolumeBackgroundSound } = useAppSelector(
		store => store.practice.paramsPractice
	);

	const [statusPractice, setStatusStatusPractice] = React.useState<StatusPractice>(StatusPractice.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const _currentTime = useRef<number>(0);
	const TimeOutId = useRef<NodeJS.Timeout | null>(null);

	const audioVoice = useRef<Audio.Sound>(new Audio.Sound()).current;
	const audioBackground = useRef<Audio.Sound | null>(null);
	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

	const timerTask = React.useRef<ReturnType<typeof initializationTimer> | null>(null);
	const appDispatch = useAppDispatch();
	const [startTimer, stopTimer] = React.useRef([
		() => {
			timerTask.current = initializationTimer(() => {
				setCurrentTime(prevCurrentTime => {
					timeLineRef.current?.setValue((prevCurrentTime + 100) / practiceLength);
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
			staysActiveInBackground: true,
			interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
			interruptionModeIOS: InterruptionModeIOS.DoNotMix,
		});
		//* Загружаем главный трек
		// Notifications.dismissAllNotificationsAsync();
		(async () => {
			if (practiceState.audio && statusPractice === StatusPractice.Loading) {
				await audioVoice.loadAsync({ uri: practiceState.audio });
				const status = await audioVoice.getStatusAsync();
				setStatusStatusPractice(
					(() => {
						if (status.isLoaded) {
							return status.isPlaying ? StatusPractice.Play : StatusPractice.Pause;
						} else {
							return StatusPractice.Loading;
						}
					})()
				);
			}
		})();

		// AppState.addEventListener("change", status => {
		// 	if (status === "active") {
		// 		Notifications.dismissNotificationAsync();
		// 	} else if (status === "background" && statusPractice === StatusPractice.Play) {
		// 		setNotificationControl();
		// 	}
		// });

		// const setNotificationControl = async (repeat: boolean = false) => {
		// 	let permission = await Notifications.getPermissionsAsync();
		// 	if (permission.granted) {
		// 		await Notifications.setNotificationCategoryAsync("~Meditation", [
		// 			{ buttonTitle: i18n.t("Pause"), identifier: "pause", options: { opensAppToForeground: true } },
		// 		]);
		// 		await Notifications.scheduleNotificationAsync({
		// 			content: {
		// 				title: selectedPractice.name,
		// 				subtitle: i18n.t("relaxation"),
		// 				color: "#9765A8",
		// 				priority: Notifications.AndroidNotificationPriority.HIGH,
		// 				autoDismiss: false,
		// 				sticky: false,
		// 				sound: false,
		// 				categoryIdentifier: "~Meditation",
		// 			},
		// 			trigger: null,
		// 		});
		// 	} else {
		// 		permission = await Notifications.requestPermissionsAsync();
		// 		if (!repeat) {
		// 			setNotificationControl(true);
		// 		}
		// 	}
		// };

		// const listenerNotification = Notifications.addNotificationResponseReceivedListener(({ actionIdentifier }) => {
		// 	if (actionIdentifier === "pause") {
		// 		pause();
		// 	}
		// });
		navigation.setOptions({
			headerRight: () => <IsFavorite practice={selectedPractice} />,
		});
		return () => {
			audioVoice.getStatusAsync().then(status => {
				if (status.isLoaded) audioVoice.stopAsync();
			});
			if (audioBackground.current !== null) {
				audioBackground.current.getStatusAsync().then(status => {
					if (audioBackground.current !== null && status.isLoaded) audioBackground.current.stopAsync();
				});
			}
			stopTimer();
			if (_currentTime.current >= 60000) {
				appDispatch(actions.addStatisticPractice([selectedPractice, Math.floor(_currentTime.current)]));
			}

			// Notifications.removeNotificationSubscription(listenerNotification);
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
					})
				).sound;
				const status = await audioBackground.current.getStatusAsync();
				if (status.isLoaded && status.durationMillis)
					await audioBackground.current.setPositionAsync(currentTime % status.durationMillis);
				if (statusPractice === StatusPractice.Play) {
					await audioBackground.current.playAsync();
				}
			}
		},
		[statusPractice, currentTime]
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

	const play = React.useCallback(async () => {
		await Promise.all([
			new Promise(async (resolve, reject) => {
				if ((await audioVoice.getStatusAsync()).isLoaded) {
					await audioVoice.playAsync();
				}
				resolve(undefined);
			}),
			new Promise(async (resolve, reject) => {
				if (audioBackground.current !== null && (await audioBackground.current.getStatusAsync()).isLoaded) {
					await audioBackground.current.playAsync();
				}
				resolve(undefined);
			}),
		]);
		startTimer();
		setStatusStatusPractice(StatusPractice.Play);
	}, []);

	const pause = React.useCallback(async (editStatus: boolean = true) => {
		await Promise.all([
			new Promise(async (resolve, reject) => {
				if ((await audioVoice.getStatusAsync()).isLoaded) {
					await audioVoice.pauseAsync();
				}
				resolve(undefined);
			}),
			new Promise(async (resolve, reject) => {
				if (audioBackground.current !== null && (await audioBackground.current.getStatusAsync()).isLoaded) {
					await audioBackground.current.pauseAsync();
				}
				resolve(undefined);
			}),
		]);
		stopTimer();
		if (editStatus) setStatusStatusPractice(StatusPractice.Pause);
	}, []);

	const update = React.useCallback(
		async (millisecond: number, needUpdateTimeLineRef: boolean = true, needTimeOut: boolean = false) => {
			setCurrentTime(millisecond);
			_currentTime.current = millisecond;
			const updateAudio = async (millisecond: number) =>
				await Promise.all([
					new Promise(async (resolve, reject) => {
						const mainAudioState = await audioVoice.getStatusAsync();
						if (mainAudioState.isLoaded) {
							await audioVoice.setPositionAsync(
								millisecond > (mainAudioState.durationMillis ?? 0) ? mainAudioState.durationMillis ?? 0 : millisecond
							);
						}
						resolve(undefined);
					}),
					new Promise(async (resolve, reject) => {
						if (audioBackground.current !== null) {
							const audioBackgroundState = await audioBackground.current.getStatusAsync();
							// if (audioBackgroundState.isLoaded) {
							// 	await audioBackground.current.setPositionAsync(millisecond % (audioBackgroundState.durationMillis ?? 0));
							// }
						}
						resolve(undefined);
					}),
				]);

			if (TimeOutId.current !== null) clearTimeout(TimeOutId.current);
			if (needTimeOut) {
				TimeOutId.current = setTimeout(updateAudio, 200, millisecond);
			} else {
				await updateAudio(millisecond);
			}
			if (needUpdateTimeLineRef) timeLineRef.current?.setValue(millisecond / practiceLength);
		},
		[]
	);

	useFocusEffect(
		useCallback(() => {
			if (Platform.OS === "android") {
				StatusBar.setStatusBarTranslucent(true);
			}
			StatusBar.setStatusBarStyle("light");
			navigation.setOptions({
				title: selectedPractice.name,
			});
		}, [])
	);
	return (
		<View style={{ flex: 1 }}>
			<StatusBar.StatusBar style="light" hidden={false} translucent backgroundColor={undefined} />
			<SharedElement id={`practice.item.${selectedPractice.id}`} style={styles.imageBackground}>
				<Image
					source={{
						uri: practiceState.image,
					}}
					style={{ flex: 1 }}
				/>
			</SharedElement>
			<Animated.View style={[styles.background]}>
				<View style={styles.panelControlContainer}>
					{statusPractice === StatusPractice.Loading ? (
						<ActivityIndicator color={"#FFFFFF"} size={"large"} />
					) : (
						<PlayerControl
							isPlay={statusPractice === StatusPractice.Play}
							pause={pause}
							play={play}
							stepBack={async () => {
								update(currentTime < 15000 ? currentTime : currentTime - 15000);
							}}
							stepForward={async () => {
								update(currentTime + 15000);
							}}
							rewindMillisecond={15000}
						/>
					)}
				</View>
				<View style={[styles.timeInfoBox]}>
					<TimeLine
						ref={timeLineRef}
						disable={statusPractice === StatusPractice.Loading}
						onChange={async percent => {
							await update(practiceLength * percent, false, true);
						}}
						onStartChange={() => {
							if (statusPractice === StatusPractice.Play) {
								pause(false);
								setStatusStatusPractice(StatusPractice.Change);
							} else {
								pause();
							}
							pause();
							if (statusPractice === StatusPractice.Play) {
								setStatusStatusPractice(StatusPractice.Change);
							}
						}}
						onEndChange={() => {
							if (statusPractice === StatusPractice.Change || statusPractice === StatusPractice.Play) {
								play();
							}
						}}
					/>
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{i18n.strftime(new Date(currentTime), "%M:%S")}
						</Text>
						<Text style={styles.timeCode} key={"all"}>
							{i18n.strftime(new Date(practiceLength), "%M:%S")}
						</Text>
					</View>
					<Pressable
						style={styles.buttonBackgroundSound}
						onPress={() =>
							navigation.navigate("SelectBackgroundSound", {
								backgroundImage: { uri: practiceState.image },
							})
						}
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
			</Animated.View>
		</View>
	);
};

export default PlayerForRelaxation;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "rgba(0, 0, 0, 0.2)",
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingBottom: 37,
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
	},
	timesCodeBox: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 5,
	},
	timeCode: {
		fontSize: 14,
		color: "#FFFFFF",
		...Tools.gStyle.font("400"),
		opacity: 0.7,
	},
	buttonBackgroundSound: {
		alignSelf: "flex-start",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		paddingRight: 33,
		paddingLeft: 13,
		marginTop: 17,
		height: 50,
		borderRadius: 25,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
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
