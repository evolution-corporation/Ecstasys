/** @format */

import React, { useCallback, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, AppState, ActivityIndicator, Platform } from "react-native";
import Animated from "react-native-reanimated";
import Headphones from "assets/icons/Headphones_white.svg";

import { TimeLine, PlayerControl, ColorButton } from "~components/dump";

import { RootScreenProps } from "~types";

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { actions, useAppDispatch, useAppSelector } from "~store";
import i18n from "~i18n";
import gStyle from "~styles";
import { SharedElement } from "react-navigation-shared-element";
import * as StatusBar from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import BackgroundSound from "src/backgroundSound";

enum StatusPractice {
	Loading,
	Play,
	Pause,
	Change,
}
const PlayerForPractice: RootScreenProps<"PlayerForPractice"> = ({ navigation, route }) => {
	const { selectedPractice } = route.params;
	const { image, audio, name, length, id } = useAppSelector(store => {
		if (!store.practice.currentPractice) {
			throw new Error("not found Practice");
		}
		return store.practice.currentPractice;
	});
	if (audio === undefined) throw new Error("212");
	const { currentNameBackgroundSound, currentVolumeBackgroundSound } = useAppSelector(
		store => store.practice.paramsPractice
	);
	const [statusPractice, setStatusPractice] = React.useState<StatusPractice>(StatusPractice.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const audioBackground = useRef<Audio.Sound | null>(null);
	const _currentTime = useRef<number>(0);

	const appDispatch = useAppDispatch();

	const audioVoice = useRef<Audio.Sound>(new Audio.Sound()).current;
	const TimeOutId = useRef<NodeJS.Timeout | null>(null);
	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

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
		setStatusPractice(StatusPractice.Play);
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
		if (editStatus) setStatusPractice(StatusPractice.Pause);
	}, []);

	useEffect(() => {
		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
			interruptionModeIOS: InterruptionModeIOS.DoNotMix,
		});
		const init = async () => {
			// Загрузка треков
			if (statusPractice === StatusPractice.Loading) {
				// await Promise.all([
				// 	new Promise(async (resolve, reject) => {
				// 		if (statusPractice === StatusPractice.Loading) {
				// 			await audioVoice.loadAsync({ uri: audio }, { progressUpdateIntervalMillis: 100 });
				// 		}
				// 		audioVoice.setOnPlaybackStatusUpdate(status => {
				// 			if (status.isLoaded) {
				// 				setCurrentTime(status.positionMillis);
				// 				_currentTime.current = status.positionMillis;
				// 			}
				// 		});
				// 		resolve(undefined);
				// 	}),
				// 	new Promise(async (resolve, reject) => {
				// 		if (currentNameBackgroundSound) {
				// 			setBackgroundSound(currentNameBackgroundSound, currentVolumeBackgroundSound);
				// 		}
				// 		resolve(undefined);
				// 	}),
				// ]);
				if (statusPractice === StatusPractice.Loading) {
					await audioVoice.loadAsync({ uri: audio }, { progressUpdateIntervalMillis: 100 });
				}
				audioVoice.setOnPlaybackStatusUpdate(status => {
					if (status.isLoaded) {
						setCurrentTime(status.positionMillis);
						_currentTime.current = status.positionMillis;
					}
				});
				setStatusPractice(StatusPractice.Pause);
				//Создание подписок на треки
			}
		};
		init();
		return () => {
			Promise.all([
				new Promise(resolve =>
					audioVoice.getStatusAsync().then(status => {
						if (status.isLoaded) {
							audioVoice.stopAsync();
							return resolve(status.positionMillis);
						}
					})
				),
				new Promise(resolve => {
					if (audioBackground.current !== null) {
						audioBackground.current.getStatusAsync().then(status => {
							if (status.isLoaded && audioBackground.current !== null) {
								audioBackground.current.stopAsync();
								return resolve(status.positionMillis);
							}
						});
					}
				}),
			]);
			if (_currentTime.current >= 60000) {
				appDispatch(actions.addStatisticPractice([selectedPractice, Math.floor(_currentTime.current)]));
			}
		};
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

	const update = React.useCallback(
		async (millisecond: number, needUpdateTimeLineRef: boolean = true, needTimeOut: boolean = false) => {
			setCurrentTime(millisecond);
			_currentTime.current = millisecond;
			const updateAudio = async (millisecond: number) =>
				await Promise.all([
					new Promise(async (resolve, reject) => {
						const mainAudioState = await audioVoice.getStatusAsync();
						if (mainAudioState.isLoaded) {
							await audioVoice.setPositionAsync(millisecond);
						}
						resolve(undefined);
					}),
					new Promise(async (resolve, reject) => {
						if (audioBackground.current !== null) {
							// const audioBackgroundState = await audioBackground.current.getStatusAsync();
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
			if (needUpdateTimeLineRef) timeLineRef.current?.setValue(millisecond / length);
		},
		[]
	);

	const updateStep = async (millisecond: number) => {
		const needPlay = statusPractice === StatusPractice.Play;
		await update(millisecond);
		if (needPlay) await play();
	};
	useFocusEffect(
		useCallback(() => {
			StatusBar.setStatusBarTranslucent(true);
			StatusBar.setStatusBarStyle("light");
			navigation.setOptions({
				title: name,
			});
		}, [])
	);

	const openBackgroundSound = React.useCallback(
		() => () => {
			navigation.navigate("SelectBackgroundSound", {
				backgroundImage: { uri: image },
			});
		},
		[image]
	);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar.StatusBar style="light" hidden={false} translucent backgroundColor={undefined} />
			<SharedElement id={`practice.item.${id}`} style={styles.imageBackground}>
				<Image
					source={{
						uri: image,
					}}
					style={{ width: "100%", height: "100%" }}
				/>
			</SharedElement>
			<Animated.View style={[styles.background]}>
				<View style={styles.panelControlContainer}>
					{statusPractice === StatusPractice.Loading ? (
						<ActivityIndicator color={"#FFFFFF"} size={"large"} />
					) : (
						<PlayerControl
							isPlay={statusPractice === StatusPractice.Play || statusPractice === StatusPractice.Change}
							pause={pause}
							play={play}
							stepBack={async () => {
								updateStep(length - 15000);
							}}
							stepForward={async () => {
								updateStep(length + 15000);
							}}
							rewindMillisecond={15000}
						/>
					)}
				</View>
				<View style={styles.timeInfoBox}>
					<TimeLine
						ref={timeLineRef}
						disable={statusPractice === StatusPractice.Loading}
						onChange={async percent => {
							await update(length * percent, false, true);
						}}
						onStartChange={() => {
							if (statusPractice === StatusPractice.Play) {
								pause(false);
								setStatusPractice(StatusPractice.Change);
							} else {
								pause();
							}
						}}
						onEndChange={() => {
							if (statusPractice === StatusPractice.Change || statusPractice === StatusPractice.Play) play();
						}}
					/>
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{i18n.strftime(new Date(currentTime), "%-H:%M:%S")}
						</Text>
						<Text style={styles.timeCode} key={"all"}>
							{i18n.strftime(new Date(length), "%-H:%M:%S")}
						</Text>
					</View>
					<ColorButton
						styleButton={styles.buttonBackgroundSound}
						styleText={styles.buttonBackgroundText}
						secondItem={<Headphones style={{ marginRight: 24 }} />}
						onPress={() => openBackgroundSound()}
					>
						{i18n.t(
							currentNameBackgroundSound !== null
								? BackgroundSound[currentNameBackgroundSound].translate
								: "12ee6d3a-ad58-4c4a-9b87-63645efe9c90"
						)}
					</ColorButton>
				</View>
			</Animated.View>
		</View>
	);
};

export default PlayerForPractice;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "rgba(0, 0, 0, 0.2)",
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: 20,
		// paddingBottom: 37,
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	imageBackground: {
		position: "absolute",
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
		bottom: 0,
	},
	timeCode: {
		fontSize: 14,
		color: "#FFFFFF",
		...gStyle.font("400"),
		opacity: 0.7,
	},
	buttonBackgroundSound: {
		alignSelf: "flex-start",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		paddingRight: 33,
		paddingLeft: 13,
		marginTop: 17,
		height: 50,
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
		...gStyle.font("400"),
	},
	panelControlContainer: {
		alignSelf: "center",
		position: "absolute",
		width: "100%",
		top: "50%",
	},
});
