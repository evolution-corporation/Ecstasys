/** @format */

import { Audio } from "expo-av";
import React from "react";
import { AppState, InteractionManager } from "react-native";

const useTrigger = (positionTrigger: number[], currentTime: number, isPlay: boolean) => {
	const triggerSound = React.useRef<Audio.Sound>(new Audio.Sound()).current;
	const triggerSoundPromise = React.useRef<{ (): void }[]>();

	const removeTriggers = () => {
		if (triggerSoundPromise.current !== undefined) triggerSoundPromise.current.map(triggerPromise => triggerPromise());
		triggerSoundPromise.current = [];
	};

	const workFocusApp = () => {
		for (const time of positionTrigger) {
			if (currentTime > time - 200 && currentTime < time + 200) {
				triggerSound.getStatusAsync().then(async status => {
					if (status.isLoaded && !status.isPlaying) {
						await triggerSound.setPositionAsync(0);
						await triggerSound.playAsync();
					}
				});
				break;
			}
		}
	};

	const workBlurApp = () => {
		removeTriggers();
		for (const time of positionTrigger) {
			if (time - 200 > currentTime) {
				const timer = InteractionManager.runAfterInteractions(() =>
					setTimeout(
						() =>
							triggerSound.getStatusAsync().then(async status => {
								if (status.isLoaded && !status.isPlaying) {
									await triggerSound.setPositionAsync(0);
									await triggerSound.playAsync();
								}
							}),
						time - currentTime - 200
					)
				);
				triggerSoundPromise.current.push(() => InteractionManager.clearInteractionHandle(timer));
			}
		}
	};

	React.useEffect(() => {
		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
		});
		triggerSound.getStatusAsync().then(({ isLoaded }) => {
			if (!isLoaded) triggerSound.loadAsync(require("assets/triggerSounds/b51f4cc4-55e4-4734-97e6-8d581a201a2a.mp3"));
		});

		const subscribe = AppState.addEventListener("change", state => {
			if (state === "active") {
				removeTriggers();
			} else if (state === "background") {
				workBlurApp();
			}
		});

		return () => {
			triggerSound.getStatusAsync().then(({ isLoaded }) => {
				if (isLoaded) triggerSound.stopAsync();
			});
			subscribe.remove();
		};
	}, []);

	React.useEffect(() => {
		if (isPlay && AppState.currentState === "active") workFocusApp();
	}, [currentTime, isPlay]);
};

export default useTrigger;
