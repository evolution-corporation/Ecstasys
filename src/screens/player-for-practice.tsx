/** @format */

import React from "react";
import { Image, Pressable } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import PlayerView, { Status } from "src/components/Elements/player-view";
import useBackgroundSound from "src/hooks/use-background-sound";
import useBreathingController from "src/hooks/use-breathing-controller";
import useMeditation from "src/hooks/use-meditation";
import useTimer from "src/hooks/use-timer";
import { actions, useAppDispatch } from "~store";

import { Breathing, RootScreenProps } from "~types";
import { meditationIsLisent, MeditationIsLisent } from "../api/requests";
import { AVPlaybackSource } from "expo-av";

const PlayerForPractice: RootScreenProps<"PlayerForPractice"> = ({ navigation, route }) => {
	const { selectedPractice, timeNotification, selectSet, nameConent } = route.params;
	const timeTrack = selectedPractice.length + (selectSet?.length ?? 0);
	const appDispatch = useAppDispatch();
	const timer = useTimer(timeTrack, () => navigation.navigate("EndMeditation"));
	const [lastPressTime, setLastPressTime] = React.useState<Date>(new Date());
	const [statusPlayer, setStatusPlayer] = React.useState<Status>(Status.Loading);
	const breathingController = useBreathingController();

	let meditation: undefined | ReturnType<typeof useMeditation>;

	if (selectedPractice.audio !== undefined) {
		const sss: [AVPlaybackSource] | [AVPlaybackSource, AVPlaybackSource] = [
			{
				uri: selectedPractice.audio,
			},
		];

		if (selectSet !== undefined) {
			sss.push({ uri: selectSet.audio });
		}
		meditation = useMeditation(sss, timer.currentMilliseconds);
	}

	React.useEffect(() => {
		if (meditation?.isLoading) {
			setImmediate(() => setStatusPlayer(Status.Init));
		} else {
			setStatusPlayer(Status.Loading);
		}
	}, [meditation?.isLoading]);

	const timerShowBigTimer = React.useRef<NodeJS.Timeout>();

	React.useEffect(() => {
		if (statusPlayer === Status.Play) {
			if (timerShowBigTimer.current) clearTimeout(timerShowBigTimer.current);
			timerShowBigTimer.current = setTimeout(() => {
				setStatusPlayer(Status.Wait);
			}, 30000);
		}
		return () => {
			if (timerShowBigTimer.current) clearTimeout(timerShowBigTimer.current);
		};
	}, [lastPressTime, statusPlayer]);

	const isSupportBackgroundSound = selectSet === undefined;

	const backgroundSound = isSupportBackgroundSound ? useBackgroundSound(statusPlayer === Status.Play) : undefined;

	const backgroundImage = {
		uri: selectedPractice.image,
	};

	React.useEffect(() => {
		const exit = (event: { data: { action: { type: string } }; preventDefault: () => void }) => {
			if (
				event.data.action.type === "GO_BACK" &&
				timer.currentMilliseconds < selectedPractice.length + (selectSet?.length ?? 0)
			) {
				if (statusPlayer !== Status.Loading && statusPlayer !== Status.Init) {
					event.preventDefault();
					navigation.navigate("NoExitMeditation");
				}
			} else {
				if (statusPlayer !== Status.Loading) {
					meditation?.stop();
					timer.edit(0);

					if (timer.currentMilliseconds >= 60000) {
						appDispatch(actions.addStatisticPractice([selectedPractice, Math.floor(timer.currentMilliseconds)]));
						if (timer.currentMilliseconds === selectedPractice.length) {
							meditationIsLisent(selectedPractice.id);
						}
					}
				}
			}
		};
		navigation.addListener("beforeRemove", exit);
		return () => {
			navigation.removeListener("beforeRemove", exit);
		};
	}, [navigation, timer, statusPlayer]);

	//! Fix with update state React
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const __fixEditCurrentTime = React.useRef<number>(0);

	const setNotification = (currentTime: number) => {
		if (timeNotification !== undefined) {
			const timeLeft: { type: Breathing; time: number }[] = [];
			for (const { time, type } of timeNotification) {
				if (time > currentTime) {
					timeLeft.push({ type, time: time - currentTime });
				}
			}
			breathingController.set(timeLeft);
		}
	};

	return (
		<Pressable style={{ flex: 1 }} onPressIn={() => setLastPressTime(new Date())}>
			<SharedElement
				id={`practice.item.${selectedPractice.id}`}
				style={{ position: "absolute", width: "100%", height: "100%" }}
			>
				<Image source={backgroundImage} style={{ flex: 1 }} />
			</SharedElement>
			<PlayerView
				currentMilliseconds={timer.currentMilliseconds}
				lengthMilliseconds={timeTrack}
				description={selectedPractice.description}
				onChangeStatus={async status => {
					if (status === Status.Play) {
						timer.play();
						meditation?.play();
						backgroundSound?.control.play();
						setNotification(timer.currentMilliseconds);
					} else if (status === Status.Pause) {
						timer.pause();
						meditation?.pause();
						backgroundSound?.control.pause();

						breathingController.remove();
					}
					setStatusPlayer(status);
				}}
				onChangeCurrentMilliseconds={async milliseconds => {
					timer.edit(milliseconds);
					__fixEditCurrentTime.current = milliseconds;
				}}
				onChangeEnd={async () => {
					meditation?.setPosition(__fixEditCurrentTime.current);
					if (statusPlayer === Status.Play) {
						timer.play();
						backgroundSound?.control.play();
						setNotification(__fixEditCurrentTime.current);
					}
				}}
				onChangeStart={async () => {
					// if (statusPlayer === Status.Play) {
					// 	isNeedStart.current = true
					// }
					timer.pause();
					backgroundSound?.control.pause();
					breathingController.remove();
				}}
				status={statusPlayer}
				isSupportBackgroundSound={isSupportBackgroundSound}
				backgroundImageForBackgroundSound={backgroundImage}
				nameBackgroundSound={backgroundSound?.name}
			/>
		</Pressable>
	);
};

export default PlayerForPractice;
