/** @format */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import ElementSimpleText from "~components/Text/element-simple-text";
import i18n from "~i18n";

interface GradientShowTimeMeditationProperty {
	timeMilliseconds: number;
}

const GradientShowTimeMeditation: React.FC<GradientShowTimeMeditationProperty> = properties => {
	const { timeMilliseconds } = properties;
	return (
		<LinearGradient
			style={{
				borderRadius: 10,
				paddingHorizontal: 34,
				height: 30,
				alignItems: "center",
				justifyContent: "center",
				width: "auto",
			}}
			colors={["#9765A8", "#9765A8"]}
		>
			<ElementSimpleText color={"#FFFFFF"}>
				{i18n.t("minute", {
					count: Math.floor(timeMilliseconds / 60000),
				})}
			</ElementSimpleText>
		</LinearGradient>
	);
};

export default GradientShowTimeMeditation;
