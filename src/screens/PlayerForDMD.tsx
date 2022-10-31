/** @format */

import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

import { TimeLine, PlayerControl } from "~components/dump";

import { RootScreenProps } from "~types";

import { Audio } from "expo-av";
import { actions, useAppDispatch, useAppSelector } from "~store";
import i18n from "~i18n";
import gStyle from "~styles";
import { SharedElement } from "react-navigation-shared-element";
import { setSetForDMD } from "src/store/actions/DMD";

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
		const activate = store.DMD.configuratorNotification.activate;
		const random = store.DMD.configuratorNotification.random + activate;
		return [option, activate, random];
	});

	const appDispatch = useAppDispatch();

	const [statusDMD, setStatusStatusDMD] = React.useState<Status>(Status.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const audioOption = useRef<Audio.Sound>(new Audio.Sound()).current;
	const audioSet = useRef<Audio.Sound>(new Audio.Sound()).current;
	const TimeOutId = useRef<NodeJS.Timeout | null>(null);
	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

	const triggerSound = React.useRef<Audio.Sound>(new Audio.Sound()).current;

	useEffect(() => {
		console.log("mount");
		const init = async () => {
			// Загрузка треков
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
						triggerSound.setOnPlaybackStatusUpdate(status => {
							if (status.isLoaded && status.didJustFinish) {
								triggerSound.pauseAsync();
								triggerSound.setPositionAsync(0);
							}
						});
					}),
				]);
				//Создание подписок на треки
				audioOption.setOnPlaybackStatusUpdate(status => {
					if (status.isLoaded) {
						setCurrentTime(prevCurrentTime =>
							prevCurrentTime <= optionTriggerTime ? status.positionMillis : prevCurrentTime
						);
						if (status.didJustFinish) {
							audioSet.playAsync();
							triggerSound.playAsync();
						}
					}
				});

				audioSet.setOnPlaybackStatusUpdate(async status => {
					const statusOption = await audioOption.getStatusAsync();
					if (status.isLoaded && statusOption.isLoaded && !statusOption.isPlaying) {
						setCurrentTime(prevCurrentTime => status.positionMillis + statusOption.positionMillis);
						if (
							(status.isPlaying &&
								status.positionMillis > activateTriggerTime - 1000 &&
								status.positionMillis < activateTriggerTime) ||
							(status.positionMillis > randomTriggerTime - 1000 && status.positionMillis < randomTriggerTime)
						) {
							triggerSound.getStatusAsync().then(status => {
								if (status.isLoaded && !status.isPlaying) {
									triggerSound.playAsync();
								}
							});
						}
					}
				});
			}

			// Определение начального состояния
			const optionStatus = await audioOption.getStatusAsync();
			const setStatus = await audioSet.getStatusAsync();
			if (setStatus.isLoaded && optionStatus.isLoaded) {
				setStatusStatusDMD(setStatus.isPlaying || optionStatus.isPlaying ? Status.Play : Status.Pause);
			} else {
				setStatusStatusDMD(Status.Pause);
			}
			if (currentTime > 0) {
				timeLineRef.current?.setValue(currentTime / allLength);
			}
		};
		init();
		return () => {
			Promise.all([
				new Promise(resolve =>
					audioOption.getStatusAsync().then(status => {
						if (status.isLoaded) {
							audioOption.stopAsync();
							return resolve(status.positionMillis);
						}
					})
				),
				new Promise(resolve =>
					audioSet.getStatusAsync().then(status => {
						if (status.isLoaded) {
							audioSet.stopAsync();
							return resolve(status.positionMillis);
						}
					})
				),
			]);
		};
	}, []);

	const play = async () => {
		const isLoaded = (await audioOption.getStatusAsync()).isLoaded && (await audioSet.getStatusAsync()).isLoaded;
		if (isLoaded) {
			if (currentTime < optionTriggerTime) {
				await audioOption.playAsync();
			} else {
				await audioSet.playAsync();
			}
			setStatusStatusDMD(Status.Play);
		}
	};

	const pause = async (editStatus: boolean = true) => {
		const isLoaded = (await audioOption.getStatusAsync()).isLoaded && (await audioSet.getStatusAsync()).isLoaded;
		if (isLoaded) {
			await audioOption.pauseAsync();
			await audioSet.pauseAsync();
			if (editStatus) setStatusStatusDMD(Status.Pause);
		}
	};

	const update = async (millisecond: number, needUpdateTimeLineRef: boolean = true, needTimeOut: boolean = false) => {
		const updateAudio = async (millisecond: number) => {
			await Promise.all([
				new Promise(async resolve => {
					const status = await audioSet.getStatusAsync();
					if (status.isLoaded) {
						if (status.isPlaying) await audioOption.pauseAsync();
						audioSet.setPositionAsync(millisecond > optionTriggerTime ? millisecond - optionTriggerTime : 0);
					}
					resolve(undefined);
				}),
				new Promise(async resolve => {
					const status = await audioOption.getStatusAsync();
					if (status.isLoaded) {
						if (status.isPlaying) await audioOption.pauseAsync();
						audioOption.setPositionAsync(millisecond < optionTriggerTime ? millisecond : optionTriggerTime);
					}
					resolve(undefined);
				}),
			]);
		};

		if (TimeOutId.current !== null) clearTimeout(TimeOutId.current);
		if (needTimeOut) {
			TimeOutId.current = setTimeout(updateAudio, 200, millisecond);
		} else {
			await updateAudio(millisecond);
		}
		if (needUpdateTimeLineRef) timeLineRef.current?.setValue(millisecond / allLength);
	};

	useEffect(() => {
		console.log(Status[statusDMD]);
	}, [statusDMD]);

	const updateStep = async (millisecond: number) => {
		const needPlay = statusDMD === Status.Play;
		await update(millisecond);
		if (needPlay) await play();
	};

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
								updateStep(currentTime > 15000 ? currentTime - 15000 : currentTime);
							}}
							stepForward={async () => {
								updateStep(currentTime + 15000 < allLength ? currentTime + 15000 : allLength);
							}}
							rewindMillisecond={15000}
						/>
					)}
				</View>
				<View style={styles.timeInfoBox}>
					<TimeLine
						ref={timeLineRef}
						disable={statusDMD === Status.Loading}
						onChange={async percent => {
							await update(allLength * percent, false, true);
						}}
						onStartChange={() => {
							if (statusDMD === Status.Play) {
								pause(false);
								setStatusStatusDMD(Status.Change);
							} else {
								pause();
							}
						}}
						onEndChange={() => {
							if (statusDMD === Status.Change) play();
						}}
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
