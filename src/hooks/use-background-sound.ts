import { Audio, AVPlaybackSource } from "expo-av";
import React from "react";
import { useAppSelector } from "~store";
import BackgroundSound from "src/backgroundSound";

const useBackgroundSound = (isPlaying: boolean) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const { currentNameBackgroundSound, currentVolumeBackgroundSound } = useAppSelector(
		store => store.practice.paramsPractice
	);
	const audio = React.useRef<Audio.Sound | null>(null);

	const setBackgroundSound = async (source: AVPlaybackSource) => {
		setIsLoading(true);
		if (!!currentNameBackgroundSound) {
			const backgroundSound = await Audio.Sound.createAsync(source, {
				isLooping: true,
				volume: currentVolumeBackgroundSound,
			});
			audio.current = backgroundSound.sound;
			if (isPlaying) await audio.current.playAsync();
		}
		setIsLoading(false);
	};

	const removeBackgroundSound = async () => {
		if (!!audio.current) {
			audio.current.stopAsync();
		}
	};

	React.useEffect(() => {
		if (!!currentNameBackgroundSound && !isLoading) {
			setBackgroundSound(BackgroundSound[currentNameBackgroundSound].audio);
		}
		return () => {
			removeBackgroundSound();
		};
	}, [currentNameBackgroundSound]);

	React.useEffect(() => {
		if (!!audio.current) {
			audio.current.setVolumeAsync(currentVolumeBackgroundSound);
		}
	}, [currentVolumeBackgroundSound]);

	React.useEffect(() => {
		if (!!audio.current) {
			if (isPlaying) {
				audio.current.playAsync();
			} else {
				audio.current.pauseAsync();
			}
		}
	}, [isPlaying]);

	return isLoading;
};

export default useBackgroundSound;
