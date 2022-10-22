/** @format */

import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { TimeLine, PlayerControl, ColorButton } from "~components/dump";

import { PracticesMeditation, RootScreenProps } from "~types";
import Practice, { BackgroundSound } from "src/models/practices";

import { Audio } from "expo-av";
import core from "~core";
import { initializationTimer } from "src/TaskManager";
import Headphones from "assets/icons/Headphones_white.svg";
import { useAppSelector } from "~store";

enum StatusPractice {
	Loading,
	Play,
	Pause,
	Change,
}

const PlayerForPractice: RootScreenProps<"PlayerForPractice"> = ({ navigation, route }) => {
	const { practiceState } = route.params;
	const selectBackgroundSound = useAppSelector(store => store.practice.selectBackgroundMusicName);

	const [statusPractice, setStatusStatusPractice] = React.useState<StatusPractice>(StatusPractice.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);

	const practice = useRef<Practice>(Practice.createByState(practiceState)).current;
	const audioVoice = useRef<Audio.Sound>(new Audio.Sound()).current;
	const audioBackground = useRef<Audio.Sound | null>(null);

	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

	const timerTask = React.useRef<ReturnType<typeof initializationTimer> | null>(null);

	const [startTimer, stopTimer] = React.useRef([
		() => {
			timerTask.current = initializationTimer(() => {
				setCurrentTime(prevCurrentTime => {
					timeLineRef.current?.setValue((prevCurrentTime + 100) / practice.length);
					if (prevCurrentTime + 100 > practice.length) {
						stopTimer();
					}
					return prevCurrentTime + 100;
				});
			});
		},
		() => {
			if (timerTask.current !== null) timerTask.current();
		},
	]).current;

	useEffect(() => {
		console.log("mount");
		//* Загружаем главный трек
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
		//* Создаем счетчик времени прослушивания
		return () => {
			console.log("unmount");
			audioVoice.getStatusAsync().then(status => {
				if (status.isLoaded) audioVoice.stopAsync();
			});
			if (audioBackground.current !== null) {
				audioBackground.current.getStatusAsync().then(status => {
					if (audioBackground.current !== null && status.isLoaded) audioBackground.current.stopAsync();
				});
			}
			stopTimer();
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
		console.log("useEffect", "audioBackgroundName", selectBackgroundSound);
		if (selectBackgroundSound) {
			setBackgroundSound(selectBackgroundSound);
		} else {
			removeBackgroundSound();
		}
	}, [selectBackgroundSound]);

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

	const pause = React.useCallback(async () => {
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
		setStatusStatusPractice(StatusPractice.Pause);
	}, []);

	const update = React.useCallback(async (millisecond: number) => {
		setCurrentTime(millisecond);
		await Promise.all([
			new Promise(async (resolve, reject) => {
				const mainAudioState = await audioVoice.getStatusAsync();
				if (mainAudioState.isLoaded) {
					await audioVoice.setPositionAsync(millisecond % (mainAudioState.durationMillis ?? 0));
				}
				resolve(undefined);
			}),
			new Promise(async (resolve, reject) => {
				if (audioBackground.current !== null) {
					const audioBackgroundState = await audioBackground.current.getStatusAsync();
					if (audioBackgroundState.isLoaded) {
						await audioBackground.current.setPositionAsync(millisecond % (audioBackgroundState.durationMillis ?? 0));
					}
				}
				resolve(undefined);
			}),
		]);
		timeLineRef.current?.setValue(millisecond / practice.length);
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Image
				source={{
					uri: practice.image,
				}}
				style={styles.imageBackground}
			/>
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
								update(currentTime - 15000);
							}}
							stepForward={async () => {
								update(currentTime + 15000);
							}}
							rewindMillisecond={15000}
						/>
					)}
				</View>
				<View
					style={[
						styles.timeInfoBox,
						{
							bottom:
								practice.type === PracticesMeditation.DIRECTIONAL_VISUALIZATIONS
									? 95
									: 95 - styles.buttonBackgroundSound.height - styles.buttonBackgroundSound.marginTop,
						},
					]}
				>
					<TimeLine
						ref={timeLineRef}
						disable={statusPractice === StatusPractice.Loading}
						onChange={percent => {
							update(practice.length * percent);
						}}
						onStartChange={() => {
							pause();
							if (statusPractice === StatusPractice.Play) {
								setStatusStatusPractice(StatusPractice.Change);
							}
						}}
						onEndChange={() => {
							if (statusPractice === StatusPractice.Change) {
								play();
							}
						}}
					/>
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{core.i18n.strftime(new Date(currentTime), "%M:%S")}
						</Text>
						<Text style={styles.timeCode} key={"all"}>
							{core.i18n.strftime(new Date(practice.length), "%M:%S")}
						</Text>
					</View>
					{practice.type !== PracticesMeditation.DIRECTIONAL_VISUALIZATIONS && (
						<ColorButton
							styleButton={styles.buttonBackgroundSound}
							styleText={styles.buttonBackgroundText}
							secondItem={<Headphones style={{ marginRight: 24 }} />}
							onPress={() => {
								console.log("1234567890");
								navigation.navigate("SelectBackgroundSound", {
									backgroundImage: { uri: practice.image },
								});
							}}
						>
							{Tools.i18n.t(
								selectBackgroundSound !== null
									? BackgroundSound[selectBackgroundSound].translate
									: "12ee6d3a-ad58-4c4a-9b87-63645efe9c90"
							)}
						</ColorButton>
					)}
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
		paddingBottom: 37,
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
