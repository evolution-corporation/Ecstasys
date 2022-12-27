/** @format */

import { EventMapCore, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap } from "@react-navigation/native-stack";
import React from "react";
import { View, Image, Pressable } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import PlayerView, { Status } from "src/components/Elements/player-view";
import useBackgroundSound from "src/hooks/use-background-sound";
import useMeditation from "src/hooks/use-meditation";
import useTimer from "src/hooks/use-timer";
import { actions, useAppDispatch } from "~store";

import { RootScreenProps, RootStackList } from "~types";

const PlayerForPractice: RootScreenProps<"PlayerForPractice"> = ({ navigation, route }) => {
	const { selectedPractice } = route.params;
	if (selectedPractice === undefined) throw new Error("21382390-5654-44fc-b365-0a7f29ad68d3");
	const timeTrack = selectedPractice.length;
	const appDispatch = useAppDispatch();
	const timer = useTimer(timeTrack, () => alert("Конец"));
	const [lastPressTime, setLastPressTime] = React.useState<Date>(new Date());
	const [statusPlayer, setStatusPlayer] = React.useState<Status>(Status.Init);
	const meditation =
		selectedPractice.audio === undefined
			? undefined
			: useMeditation(
					{
						uri: selectedPractice.audio,
					},
					timer.currentMilliseconds
			  );

	React.useEffect(() => {
		if (meditation?.isLoading) {
			setStatusPlayer(Status.Init);
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
			}, 30_000);
		}
		return () => {
			if (timerShowBigTimer.current) clearTimeout(timerShowBigTimer.current);
		};
	}, [lastPressTime, statusPlayer]);

	const isSupportBackgroundSound =
		selectedPractice.type === "RELAXATION" || selectedPractice.type === "DIRECTIONAL_VISUALIZATIONS";

	const backgroundSound = isSupportBackgroundSound ? useBackgroundSound(statusPlayer === Status.Play) : undefined;

	const backgroundImage = {
		uri: selectedPractice.image,
	};

	React.useEffect(() => {
		const exit = event => {
			if (event.data.action.type === "GO_BACK") {
				event.preventDefault();
				navigation.navigate("NoExitMeditation");
			} else {
				if (statusPlayer !== Status.Loading) {
					meditation?.stop();
					timer.edit(0);
					if (timer.currentMilliseconds >= 60_000) {
						appDispatch(actions.addStatisticPractice([selectedPractice, Math.floor(timer.currentMilliseconds)]));
					}
				}
			}
		};
		navigation.addListener("beforeRemove", exit);
		return () => {
			navigation.removeListener("beforeRemove", exit);
		};
	}, [navigation, timer, statusPlayer]);

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
					} else if (status === Status.Pause) {
						timer.pause();
						meditation?.pause();
						backgroundSound?.control.pause();
					}
					setStatusPlayer(status);
				}}
				onChangeCurrentMilliseconds={async milliseconds => {
					timer.edit(milliseconds);
				}}
				onChangeEnd={async () => {
					meditation?.setPosition(timer.currentMilliseconds);
					if (statusPlayer === Status.Play) {
						timer.play();
						backgroundSound?.control.play();
					}
				}}
				onChangeStart={async () => {
					// if (statusPlayer === Status.Play) {
					// 	isNeedStart.current = true
					// }
					timer.pause();
					backgroundSound?.control.pause();
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
