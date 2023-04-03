/** @format */

import React from "react";
import { Audio, AVPlaybackSource } from "expo-av";
import * as Notification from "expo-notifications";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";
import { AVPlaybackSourceObject } from "expo-av/src/AV.types";

const NotificationEndMeditation = () =>
	Notification.scheduleNotificationAsync({
		identifier: "EndMeditation",
		content: {
			title: "Медитация подошла к концу",
			body: "Благодарим за уделенное время",
			sound: "bells.wav",
			vibrate: [1],
			priority: Notification.AndroidNotificationPriority.MAX,
		},
		trigger: {
			seconds: 1,
			channelId: "endMeditation",
		},
	});

const useMeditation = (
	source: [AVPlaybackSource, AVPlaybackSource] | [AVPlaybackSource],
	currentTime: number,
	options?: { autoPlay?: boolean }
) => {
	const audio = React.useRef<Audio.Sound>(new Audio.Sound()).current;
	const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

	const play = async () => {
		const audioStatus = await audio.getStatusAsync();
		if (audioStatus.isLoaded && (audioStatus.durationMillis ?? 0) > currentTime) {
			await audio.playAsync();
		}
	};

	const pause = async () => {
		const audioStatus = await audio.getStatusAsync();
		if (audioStatus.isLoaded) {
			await audio.pauseAsync();
		}
	};

	const setPosition = async (milliseconds: number) => {
		const audioStatus = await audio.getStatusAsync();
		if (audioStatus.isLoaded && (audioStatus.durationMillis ?? 0) >= milliseconds) {
			await audio.setPositionAsync(milliseconds);
		}
	};

	const stop = async () => {
		const audioStatus = await audio.getStatusAsync();
		if (audioStatus.isLoaded) {
			await audio.stopAsync();
		}
	};

	React.useEffect(() => {
		audio.setOnPlaybackStatusUpdate(status => {
			setIsLoaded(previousValue => status.isLoaded);
		});

		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			shouldDuckAndroid: false,
			playThroughEarpieceAndroid: false,
			allowsRecordingIOS: false,
			playsInSilentModeIOS: true,
		});

		Notification.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: false,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
			handleSuccess: console.log,
		});

		const LeftFilePath = `${FileSystem.cacheDirectory}/meditationL.mp3`;
		const RightFilePath = `${FileSystem.cacheDirectory}/meditationR.mp3`;
		// const BackgroundFilePath = `${FileSystem.cacheDirectory}/meditationB.mp3`
		const outputFilePath = `${FileSystem.cacheDirectory}/meditation.mp3`;
		const init = async () => {
			const sourceFix = source
				.map(onceSource => {
					if (typeof onceSource === "object") {
						onceSource.uri = `${onceSource.uri}.mp3`;
						return onceSource;
					}
					return null;
				})
				.filter(item => item !== null) as [AVPlaybackSourceObject, AVPlaybackSourceObject] | [AVPlaybackSourceObject];

			console.log(sourceFix);

			await FileSystem.downloadAsync(sourceFix[0].uri, LeftFilePath);
			let command = `-i ${LeftFilePath} `;

			if (sourceFix.length === 2) {
				await FileSystem.downloadAsync(sourceFix[1].uri, RightFilePath);
				command += `-i ${RightFilePath} `;
				command += `-filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" `;
			}

			command += `-f mp3 `;
			command += `${outputFilePath}`;

			console.log(command);
			FFmpegKit.execute(command).then(async session => {
				console.log(await FileSystem.getInfoAsync(outputFilePath));
				await audio.loadAsync({ uri: outputFilePath });
				// audio.setOnPlaybackStatusUpdate(statusOfSubscribe => {
				// 	if (statusOfSubscribe.isLoaded && statusOfSubscribe.didJustFinish) {
				// 		NotificationEndMeditation();
				// 	}
				// });
			});

			// if (audioList.length === 1) {
			// 	const status = await audioList[0].getStatusAsync();
			// 	if (!status.isLoaded) await audioList[0].loadAsync(Array.isArray(sourceFix) ? sourceFix[0] : sourceFix, {});
			// 	audioList[0].setOnPlaybackStatusUpdate(statusOfSubscribe => {
			// 		if (statusOfSubscribe.isLoaded && statusOfSubscribe.didJustFinish) {
			// 			NotificationEndMeditation();
			// 		}
			// 	});
			// 	if (options?.autoPlay ?? false) audioList[0].playAsync();
			// } else if (audioList.length === 2 && Array.isArray(sourceFix)) {
			// 	const statusFirst = await audioList[0].getStatusAsync();
			// 	if (!statusFirst.isLoaded) await audioList[0].loadAsync(sourceFix[0], {});
			// 	const statusSecond = await audioList[1].getStatusAsync();
			// 	if (!statusSecond.isLoaded) await audioList[1].loadAsync(sourceFix[1], {});
			// 	audioList[0].setOnPlaybackStatusUpdate(statusOfSubscribe => {
			// 		setIsLoaded(previousValue => [statusOfSubscribe.isLoaded, previousValue[1]]);
			// 		if (statusOfSubscribe.isLoaded && statusOfSubscribe.didJustFinish) {
			// 			audioList[1].playAsync();
			// 		}
			// 	});
			// 	audioList[1].setOnPlaybackStatusUpdate(statusOfSubscribe => {
			// 		if (statusOfSubscribe.isLoaded && statusOfSubscribe.didJustFinish) {
			// 			NotificationEndMeditation();
			// 		}
			// 	});
			// 	if (options?.autoPlay ?? false) {
			// 		audioList[0].playAsync();
			// 		audioList[1].playAsync();
			// 	}
			// }
		};

		init();

		const end = async () => {
			const status = await audio.getStatusAsync();
			if (status.isLoaded) {
				audio.stopAsync();
				audio.unloadAsync();
			}

			const removeFile = (uri: string) => {
				FileSystem.getInfoAsync(uri).then(({ exists }) => {
					if (exists) FileSystem.deleteAsync(uri);
				});
			};

			removeFile(LeftFilePath);
			removeFile(RightFilePath);
			removeFile(outputFilePath);
		};
		return () => {
			Notification.cancelScheduledNotificationAsync("EndMeditation");
			end();
		};
	}, []);

	return { play, pause, setPosition, isLoading: isLoaded, stop };
};
export default useMeditation;
