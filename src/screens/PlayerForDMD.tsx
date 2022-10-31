/** @format */

import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { TimeLine, PlayerControl, ColorButton } from "~components/dump";

import { PracticesMeditation, RootScreenProps } from "~types";
import Practice, { BackgroundSound } from "src/models/practices";

import { Audio, AVPlaybackStatus } from "expo-av";
import core from "~core";
import { initializationTimer } from "src/TaskManager";
import Headphones from "assets/icons/Headphones_white.svg";
import { useAppSelector } from "~store";
import i18n from "~i18n";
import { SharedElement } from "react-navigation-shared-element";
import { useSelector } from "react-redux";

enum Status {
	Loading,
	Play,
	Pause,
	Change,
}

const PlayerForDMD: RootScreenProps<"PlayerForDMD"> = ({ navigation, route }) => {
	const [image, audioOptionURL, audioSetURL] = useAppSelector(store => {
		if (store.DMD.option === undefined) {
			throw new Error("not Found Option");
		}
		if (store.DMD.set === undefined) {
			throw new Error("not found Set");
		}
		return [store.DMD.option.image, store.DMD.option.audio, store.DMD.set.audio];
	});
	const { selectedRelax } = route.params;
	const allLength = useAppSelector(store => (store.DMD.option?.length ?? 0) + (store.DMD.set?.length ?? 0));

	const [optionTriggerTime, activateTriggerTime, randomTriggerTime] = useAppSelector(store => {
		const option = store.DMD.configuratorNotification.option ?? 0;
		const activate = store.DMD.configuratorNotification.activate + option;
		const random = store.DMD.configuratorNotification.random + activate;
		return [option, activate, random];
	});

	const [statusDMD, setStatusStatusDMD] = React.useState<Status>(Status.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);

	const audioOption = useRef<Audio.Sound>(new Audio.Sound()).current;
	const audioSet = useRef<Audio.Sound>(new Audio.Sound()).current;

	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

	const timerTask = React.useRef<ReturnType<typeof initializationTimer> | null>(null);
	const triggerSound = React.useRef<Audio.Sound>(new Audio.Sound()).current;

	const getIsPlayTriggerSound = async (time: number) => {
		const triggerSoundStatus = await triggerSound.getStatusAsync();
		if (triggerSoundStatus.isLoaded) {
			const halfTriggerLength = triggerSoundStatus.durationMillis ?? 3000 / 2;
			if (time > activateTriggerTime - halfTriggerLength && time < activateTriggerTime) return true;
			if (time > optionTriggerTime - halfTriggerLength && time < optionTriggerTime) return true;
			if (time > randomTriggerTime - halfTriggerLength && time < randomTriggerTime) return true;
		}
		return false;
	};

	const [startTimer, stopTimer] = React.useRef([
		() => {
			timerTask.current = initializationTimer(() => {
				setCurrentTime(prevCurrentTime => {
					timeLineRef.current?.setValue((prevCurrentTime + 100) / allLength);
					if (prevCurrentTime + 100 > allLength) {
						stopTimer();
					}
					getIsPlayTriggerSound(prevCurrentTime + 100).then(async isNeedTrigger => {
						const triggerSoundStatus = await triggerSound.getStatusAsync();
						if (triggerSoundStatus.isLoaded) {
							if (isNeedTrigger && !triggerSoundStatus.isPlaying) {
								await triggerSound.setPositionAsync(0);
								await triggerSound.playAsync();
							}
						}
					});

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
			if (statusDMD === Status.Loading) {
				await Promise.all([
					new Promise(async (resolve, reject) => {
						await audioSet.loadAsync({ uri: audioSetURL });
						resolve(undefined);
					}),
					new Promise(async (resolve, reject) => {
						await audioOption.loadAsync({ uri: audioOptionURL });
						resolve(undefined);
					}),
					new Promise(async (resolve, reject) => {
						await triggerSound.loadAsync(require("assets/triggerSounds/b51f4cc4-55e4-4734-97e6-8d581a201a2a.mp3"));
						resolve(undefined);
					}),
				]);
			}
			const [setStatus, optionStatus] = (await Promise.all([
				new Promise(async (resolve, reject) => {
					return resolve(await audioSet.getStatusAsync());
				}),
				new Promise(async (resolve, reject) => {
					return resolve(await audioOption.getStatusAsync());
				}),
			])) as [AVPlaybackStatus, AVPlaybackStatus];
			if (setStatus.isLoaded && optionStatus.isLoaded) {
				setStatusStatusDMD(setStatus.isPlaying || optionStatus.isPlaying ? Status.Play : Status.Pause);
			} else {
				setStatusStatusDMD(Status.Pause);
			}
		})();
		//* Создаем счетчик времени прослушивания
		return () => {
			console.log("unmount");
			audioOption.getStatusAsync().then(status => {
				if (status.isLoaded) audioOption.stopAsync();
			});
			audioSet.getStatusAsync().then(status => {
				if (status.isLoaded) audioSet.stopAsync();
			});
			stopTimer();
		};
	}, []);

	const play = React.useCallback(
		() =>
			(async time => {
				const isLoaded = (await audioOption.getStatusAsync()).isLoaded && (await audioSet.getStatusAsync()).isLoaded;
				if (isLoaded) {
					if (time <= optionTriggerTime) {
						await audioOption.playAsync();
						await audioSet.stopAsync();
					} else {
						await audioOption.pauseAsync();
						await audioSet.playAsync();
					}
					startTimer();
					setStatusStatusDMD(Status.Play);
				}
			})(currentTime),
		[currentTime]
	);

	const pause = React.useCallback(
		async (newStatus: Status = Status.Pause) => {
			const isLoaded = (await audioOption.getStatusAsync()).isLoaded && (await audioSet.getStatusAsync()).isLoaded;
			if (isLoaded) {
				await audioOption.pauseAsync();
				await audioSet.pauseAsync();
				stopTimer();
				setStatusStatusDMD(newStatus);
			}
		},
		[currentTime]
	);

	const update = React.useCallback(
		async (millisecond: number) => {
			const isLoaded = !(
				await Promise.all([
					new Promise(async resolve => {
						return resolve((await audioOption.getStatusAsync()).isLoaded);
					}),
					new Promise(async resolve => {
						return resolve((await audioSet.getStatusAsync()).isLoaded);
					}),
				])
			).includes(false);
			if (isLoaded) {
				await Promise.all([
					new Promise(async resolve => {
						await audioOption.setPositionAsync(optionTriggerTime % millisecond);
						resolve(undefined);
					}),
					new Promise(async resolve => {
						await audioSet.setPositionAsync(millisecond - optionTriggerTime < 0 ? 0 : millisecond - optionTriggerTime);
						resolve(undefined);
					}),
				]);
			}
			setCurrentTime(millisecond);

			timeLineRef.current?.setValue(millisecond / allLength);
		},
		[currentTime]
	);

	const endChange = React.useMemo(() => {
		if (statusDMD === Status.Change) {
			return play;
		} else {
			return () => {};
		}
	}, [statusDMD]);

	return (
		<View style={{ flex: 1 }}>
			<SharedElement id={`practice.item.${selectedRelax.id}`} style={styles.imageBackground}>
				<Image
					source={{
						uri: image,
					}}
					style={{ width: "100%", height: "100%" }}
				/>
			</SharedElement>
			<Animated.View style={[styles.background]}>
				<View style={styles.panelControlContainer}>
					{statusDMD === Status.Loading ? (
						<ActivityIndicator color={"#FFFFFF"} size={"large"} />
					) : (
						<PlayerControl
							isPlay={statusDMD === Status.Play}
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
				<View style={styles.timeInfoBox}>
					<TimeLine
						ref={timeLineRef}
						disable={statusDMD === Status.Loading}
						onChange={percent => {
							update(allLength * percent);
						}}
						onStartChange={() => {
							pause(statusDMD === Status.Play ? Status.Change : Status.Pause);
						}}
						onEndChange={endChange}
					/>
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{i18n.strftime(new Date(currentTime), "%-H:%M:%S")}
						</Text>
						<Text style={styles.timeCode} key={"all"}>
							{i18n.strftime(new Date(allLength), "%-H:%M:%S")}
						</Text>
					</View>
				</View>
			</Animated.View>
		</View>
	);
};

export default PlayerForDMD;

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
		bottom: 95,
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
