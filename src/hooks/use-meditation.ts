/** @format */

import React from "react";
import { AVPlaybackSource, Audio } from "expo-av";

const useMeditation = (source: [AVPlaybackSource, AVPlaybackSource], currentTime: number) => {
	const audioList = React.useRef<[Audio.Sound, Audio.Sound] | [Audio.Sound]>(
		source.length === 2 ? [new Audio.Sound(), new Audio.Sound()] : [new Audio.Sound()]
	).current;
	const [isLoaded, setIsLoaded] = React.useState<[boolean, boolean]>([false, false]);

	const play = async () => {
		if (audioList.length === 1) {
			const audioStatus = await audioList[0].getStatusAsync();
			if (audioStatus.isLoaded && (audioStatus.durationMillis ?? 0) > currentTime) {
				await audioList[0].playAsync();
			}
		} else if (audioList.length === 2) {
			const audioStatus = [await audioList[0].getStatusAsync(), await audioList[1].getStatusAsync()];
			if (audioStatus[0].isLoaded && audioStatus[1].isLoaded) {
				if ((audioStatus[0].durationMillis ?? 0) > currentTime) {
					await audioList[0].playAsync();
				} else if ((audioStatus[1].durationMillis ?? 0) + (audioStatus[0].durationMillis ?? 0) > currentTime) {
					await audioList[1].playAsync();
				}
			}
		}
	};

	const pause = async () => {
		if (audioList.length === 1) {
			const audioStatus = await audioList[0].getStatusAsync();
			if (audioStatus.isLoaded) {
				await audioList[0].pauseAsync();
			}
		} else if (audioList.length === 2) {
			const audioStatus = [await audioList[0].getStatusAsync(), await audioList[1].getStatusAsync()];
			if (audioStatus[0].isLoaded && audioStatus[1].isLoaded) {
				await audioList[0].pauseAsync();
				await audioList[1].pauseAsync();
			}
		}
	};

	const setPosition = async (milliseconds: number) => {
		if (audioList.length === 1) {
			const audioStatus = await audioList[0].getStatusAsync();
			if (audioStatus.isLoaded && (audioStatus.durationMillis ?? 0) >= milliseconds) {
				await audioList[0].setPositionAsync(milliseconds);
			}
		} else if (audioList.length === 2) {
			const audioStatus = [await audioList[0].getStatusAsync(), await audioList[1].getStatusAsync()];
			if (audioStatus[0].isLoaded && audioStatus[1].isLoaded) {
				const isPlay = audioStatus[0].isPlaying && audioStatus[1].isPlaying;
				const [lengthFirstAudio, lengthSecondAudio] = [
					audioStatus[0].durationMillis ?? 0,
					audioStatus[1].durationMillis ?? 0,
				];
				console.log({ lengthFirstAudio, lengthSecondAudio, milliseconds, isPlay });
				// await audioList[0].pauseAsync();
				// await audioList[1].pauseAsync();
				if (lengthFirstAudio > milliseconds) {
					await audioList[0].setPositionAsync(milliseconds);
					await audioList[1].setPositionAsync(0);
				} else if (lengthFirstAudio + lengthSecondAudio > milliseconds) {
					await audioList[0].setPositionAsync(lengthFirstAudio);
					await audioList[1].setPositionAsync(milliseconds - lengthFirstAudio);
				}
			}
		}
	};

	const stop = async () => {
		if (audioList.length === 1) {
			const audioStatus = await audioList[0].getStatusAsync();
			if (audioStatus.isLoaded) {
				await audioList[0].stopAsync();
			}
		} else if (audioList.length === 2) {
			const audioStatus = [await audioList[0].getStatusAsync(), await audioList[1].getStatusAsync()];
			if (audioStatus[0].isLoaded && audioStatus[1].isLoaded) {
				await audioList[0].stopAsync();
				await audioList[1].stopAsync();
			}
		}
	};

	React.useEffect(() => {
		if (audioList.length === 1) {
			audioList[0].setOnPlaybackStatusUpdate(status => {
				setIsLoaded(previousValue => [status.isLoaded, status.isLoaded]);
			});
		} else if (audioList.length === 2) {
			audioList[0].setOnPlaybackStatusUpdate(status => {
				setIsLoaded(previousValue => [status.isLoaded, previousValue[1]]);
			});
			audioList[1].setOnPlaybackStatusUpdate(status => {
				setIsLoaded(previousValue => [previousValue[0], status.isLoaded]);
			});
		}

		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
		});

		const init = async () => {
			if (audioList.length === 1) {
				const status = await audioList[0].getStatusAsync();
				if (!status.isLoaded) await audioList[0].loadAsync(Array.isArray(source) ? source[0] : source, {});
			} else if (audioList.length === 2 && Array.isArray(source)) {
				const statusFirst = await audioList[0].getStatusAsync();
				if (!statusFirst.isLoaded) await audioList[0].loadAsync(source[0], {});
				const statusSecond = await audioList[1].getStatusAsync();
				if (!statusSecond.isLoaded) await audioList[1].loadAsync(source[1], {});
				audioList[0].setOnPlaybackStatusUpdate(statusOfSubscribe => {
					setIsLoaded(previousValue => [statusOfSubscribe.isLoaded, previousValue[1]]);
					if (statusOfSubscribe.isLoaded && statusOfSubscribe.didJustFinish) {
						audioList[1].playAsync();
					}
				});
			}
		};

		init();
	}, []);

	return { play, pause, setPosition, isLoading: isLoaded[0] && isLoaded[1], stop };
};
export default useMeditation;
