/** @format */

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import DateTime from "src/global/class/date-time";
import BlackCircle from "~components/dump/black-circle";
import MeditationTimeInBox from "~components/dump/meditation-time-in-box";
import DefaultText from "~components/Text/default-text";
import i18n from "~i18n";

interface ViewPlayerProperties {
	status: "init" | "wait" | "work";
	description?: string;
	timeLength: number;
	currentTime: number;
	showHours?: boolean;
}

const ViewPlayer: React.FC<ViewPlayerProperties> = property => {
	const { status, description, timeLength, showHours = false, currentTime } = property;

	if (status === "init") {
		return (
			<View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" }}>
				<BlackCircle size={100}>
					<ActivityIndicator color={"#FFF"} />
				</BlackCircle>
				{description === undefined ? undefined : <DefaultText>{description}</DefaultText>}
				<MeditationTimeInBox milliseconds={timeLength} />
			</View>
		);
	}
	if (status === "wait")
		return (
			<View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" }}>
				<BlackCircle size={196}>
					<Text>{i18n.strftime(new DateTime(currentTime), showHours ? "%-H:%M:%S" : "%M:%S")}</Text>
				</BlackCircle>
			</View>
		);
};

export default ViewPlayer;
