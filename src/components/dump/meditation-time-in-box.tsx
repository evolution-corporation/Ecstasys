/** @format */

import React from "react";
import { View } from "react-native";
import DefaultText from "~components/Text/default-text";
import i18n from "~i18n";

interface MeditationTimeInBoxProperty {
	milliseconds: number;
}

const MeditationTimeInBox: React.FC<MeditationTimeInBoxProperty> = property => {
	const { milliseconds } = property;
	const minutes = milliseconds / 60_000;
	return (
		<View
			style={{
				backgroundColor: "#9765A8",
				height: 30,
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 34,
				borderRadius: 10,
			}}
		>
			<DefaultText color={"#FFF"}>{i18n.t("minute", { count: Math.floor(minutes) })}</DefaultText>
		</View>
	);
};

export default MeditationTimeInBox;
