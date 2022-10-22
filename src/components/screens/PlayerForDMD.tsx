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

enum Status {
	Loading,
	Play,
	Pause,
	Change,
}

const PlayerForDMD: RootScreenProps<"PlayerForDMD"> = ({ navigation, route }) => {
	const [image, audioOptionURL, audioSetURL] = useAppSelector(store => [
		store.DMD.option?.image ??
			"https://storage.yandexcloud.net/dmdmeditationimage/meditations/404-not-found-error-page-examples.png",
		store.DMD.set?.name ?? "404",
		store.DMD.option?.audio ?? "",
		store.DMD.set?.audio ?? "",
	]);
	const [activateLength, optionLength, randomLength, lengthSet, allLength] = useAppSelector(store => [
		store.DMD.configuratorNotification.activate,
		store.DMD.configuratorNotification.option ?? 0,
		store.DMD.configuratorNotification.random,
		store.DMD.set?.length ?? 0,
		store.DMD.configuratorNotification.activate +
			(store.DMD.configuratorNotification.option ?? 0) +
			store.DMD.configuratorNotification.random +
			(store.DMD.set?.length ?? 0),
	]);

	const [statusDMD, setStatusStatusDMD] = React.useState<Status>(Status.Loading);
	const [currentTime, setCurrentTime] = React.useState<number>(0);

	const audioOption = useRef<Audio.Sound>(new Audio.Sound()).current;
	const audioSet = useRef<Audio.Sound>(new Audio.Sound()).current;

	const timeLineRef = useRef<React.ElementRef<typeof TimeLine>>(null);

	const timerTask = React.useRef<ReturnType<typeof initializationTimer> | null>(null);

	const [startTimer, stopTimer] = React.useRef([
		() => {
			timerTask.current = initializationTimer(() => {
				setCurrentTime(prevCurrentTime => {
					timeLineRef.current?.setValue((prevCurrentTime + 100) / allLength);
					if (prevCurrentTime + 100 > allLength) {
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
					if (time <= optionLength) {
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
						await audioOption.setPositionAsync(optionLength % millisecond);
						resolve(undefined);
					}),
					new Promise(async resolve => {
						await audioSet.setPositionAsync(millisecond - optionLength < 0 ? 0 : millisecond - optionLength);
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
			<Image
				source={{
					uri: image,
				}}
				style={styles.imageBackground}
			/>
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
								update(currentTime - 15000);
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
							{core.i18n.strftime(new Date(currentTime - 18000000), "%-H:%M:%S")}
						</Text>
						<Text style={styles.timeCode} key={"all"}>
							{core.i18n.strftime(new Date(allLength - 18000000), "%-H:%M:%S")}
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
