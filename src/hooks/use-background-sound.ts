/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React from "react";
import BackgroundSound from "src/backgroundSound";
import i18n from "~i18n";
import { useAppSelector } from "~store";

const useBackgroundSound = (shouldPlay: boolean) => {
	const [name, volume] = useAppSelector(store => [
		store.practice.paramsPractice.currentNameBackgroundSound,
		store.practice.paramsPractice.currentVolumeBackgroundSound,
	]);

	const audio = React.useRef<Audio.Sound>();

	React.useEffect(() => {
		audio.current?.getStatusAsync().then(status => {
			if (status.isLoaded) {
				audio.current?.setVolumeAsync(volume);
			}
		});
	}, [volume]);

	const loadingAudio = async () => {
		if (name) {
			const { sound } = await Audio.Sound.createAsync(BackgroundSound[name].audio, {
				isLooping: true,
				volume,
				shouldPlay,
				progressUpdateIntervalMillis: 1000,
			});
			audio.current = sound;
			audio.current.setOnPlaybackStatusUpdate(() => {
				AsyncStorage.getItem("EndMeditationTime").then(r => {
					if (!!r) {
						const endMeditationTime = new Date(r);
						if (endMeditationTime.getTime() < Date.now()) {
							audio.current?.pauseAsync();
						}
					}
				});
			});
		}
	};

	React.useEffect(() => {
		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
		});
		if (name !== null) {
			loadingAudio();
		}

		return () => {
			audio.current?.getStatusAsync().then(status => {
				console.log(status.isLoaded);
				if (status.isLoaded) {
					audio.current?.stopAsync();
					audio.current?.unloadAsync();
				}
			});
		};
	}, [name]);

	return {
		name: i18n.t(name === null ? "12ee6d3a-ad58-4c4a-9b87-63645efe9c90" : BackgroundSound[name].translate),
		control: {
			play: async () => {
				const status = await audio.current?.getStatusAsync();
				if (status?.isLoaded) audio.current?.playAsync();
			},
			pause: async () => {
				const status = await audio.current?.getStatusAsync();
				if (status?.isLoaded) audio.current?.pauseAsync();
			},
			stop: async () => {
				const status = await audio.current?.getStatusAsync();
				if (status?.isLoaded) audio.current?.stopAsync();
			},
		},
	};
};

export default useBackgroundSound;
