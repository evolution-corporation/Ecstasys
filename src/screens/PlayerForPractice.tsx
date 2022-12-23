/** @format */

import React from "react";
import { View } from "react-native";
import PlayerView, { Status } from "src/components/Elements/player-view";
import useMeditation from "src/hooks/use-meditation";
import useTimer from "src/hooks/use-timer";

import { RootScreenProps } from "~types";

const PlayerForPractice: RootScreenProps<"PlayerForPractice"> = ({ navigation, route }) => {
	const { selectedPractice } = route.params;
	if (selectedPractice === undefined) throw new Error("21382390-5654-44fc-b365-0a7f29ad68d3");
	const timeTrack = selectedPractice.length;
	const timer = useTimer(timeTrack, () => alert("Конец"));
	const [statusPlayer, setStatusPlayer] = React.useState<Status>(Status.Init);
	const meditation = useMeditation(
		{
			uri: selectedPractice.audio,
		},
		timer.currentMilliseconds
	);
	return (
		<View style={{ flex: 1, backgroundColor: "blue" }}>
			<PlayerView
				currentMilliseconds={timer.currentMilliseconds}
				lengthMilliseconds={timeTrack}
				description={""}
				onChangeStatus={async status => {
					if (status === Status.Play) {
						timer.play();
						meditation.play();
					} else if (status === Status.Pause) {
						timer.pause();
						meditation.pause();
					}
					setStatusPlayer(status);
				}}
				onChangeCurrentMilliseconds={async milliseconds => {
					timer.edit(milliseconds);
				}}
				onChangeEnd={async () => {
					if (statusPlayer === Status.Play) {
						timer.play();
					}
				}}
				onChangeStart={async () => {
					// if (statusPlayer === Status.Play) {
					// 	isNeedStart.current = true
					// }
					timer.pause();
				}}
				status={statusPlayer}
			/>
		</View>
	);
};

export default PlayerForPractice;
