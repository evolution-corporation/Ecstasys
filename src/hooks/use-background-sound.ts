/** @format */

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
		console.log({ volume });
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
			});
			audio.current = sound;
		}
	};

	React.useEffect(() => {
		if (name !== null) {
			loadingAudio();
		}

		return () => {
			audio.current?.getStatusAsync().then(status => {
				if (status.isLoaded) {
					audio.current?.stopAsync();
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
