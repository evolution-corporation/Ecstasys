import { Audio, AVPlaybackSource } from "expo-av";
import React from "react";

enum StatusPlayer {
	Loading,
	Play,
	Pause,
	Change,
}

const usePlayer = (source: AVPlaybackSource) => {
	const [statusPlayer, setStatusPlayer] = React.useState<StatusPlayer>();
	const audio = React.useRef<Audio.Sound>(new Audio.Sound()).current;

	const loading = async () => {
		setStatusPlayer(StatusPlayer.Loading);
		await audio.loadAsync(source);
		const statusAudio = await audio.getStatusAsync();
		setStatusPlayer(
			statusAudio.isLoaded ? (statusAudio.isPlaying ? StatusPlayer.Play : StatusPlayer.Pause) : StatusPlayer.Loading
		);
	};

	const play = async () => {
		await audio.playAsync();
		setStatusPlayer(StatusPlayer.Play);
	};

	const pause = async () => {
		await audio.pauseAsync();
		setStatusPlayer(StatusPlayer.Pause);
	};

	const update = async (millisecond: number) => {
		setStatusPlayer(previousStatusPlayer =>
			previousStatusPlayer === StatusPlayer.Play ? StatusPlayer.Change : previousStatusPlayer
		);
		await audio.pauseAsync();
		await audio.setPositionAsync(millisecond);
		if (statusPlayer === StatusPlayer.Change) {
			await play();
		}
	};

	const stop = async () => {
		audio.stopAsync();
	};

	React.useEffect(() => {
		if (statusPlayer === undefined) {
			loading();
		}
		return () => {
			stop();
		};
	}, []);

	return [statusPlayer, { play, pause, update, stop }];
};

export default usePlayer;
