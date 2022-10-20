/** @format */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Tools from "~core";
import { RootScreenProps, State } from "~types";
var height = Dimensions.get("window").height;
import { DescriptionMeditationCategory, MeditationType } from "~modules/meditation";
import {
	relaxationInstruction,
	DefaultInstruction,
	InstructionDirectionalVisualization,
} from "~modules/meditation/models";
import { ColorButton } from "~components/dump";
import { DoubleColorView } from "~components/containers";

import { CarouselPractices } from "~components/dump";
import { Practice } from "src/models";
import { useFocusEffect } from "@react-navigation/native";

const PracticeListByType: RootScreenProps<"PracticeListByType"> = ({ route, navigation }) => {
	const { typePractices } = route.params;
	const { height } = useWindowDimensions();
	//* локальные стайты
	const [selectedPracticeId, setSelectedPracticeId] = useState<string | null>(null);
	const [practiceList, setPracticeList] = useState<State.Practice[]>([]);
	const opacityButton = useSharedValue(1);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			opacity: withTiming(opacityButton.value),
		})),
	};

	useFocusEffect(
		useCallback(() => {
			(async () => {
				setPracticeList((await Practice.getByType(typePractices)).map(practice => practice.getState()));
			})();
		}, [])
	);

	const showInstruction = useMemo(() => {
		// switch (typeMeditation) {
		// 	case "relaxation":
		// 		return relaxationInstruction;
		// 	case "directionalVisualizations":
		// 		return InstructionDirectionalVisualization;
		// 	default:
		// 		return DefaultInstruction;
		// }
	}, [typePractices]);

	return (
		<DoubleColorView style={styles.background} heightViewPart={height / 2 - 100}>
			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.buttonInstruction}
				styleText={styles.buttonTextInstruction}
				colors={["#75348B", "#6A2382"]}
				onPress={() => {}}
			>
				{Tools.i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750")}
			</ColorButton>
			<Text style={styles.descriptionType}>
				{Tools.i18n.t(DescriptionMeditationCategory[route.params.typePractices].text)}
			</Text>
			{practiceList.length > 0 && (
				<CarouselPractices
					data={practiceList}
					style={{ width: Dimensions.get("window").width, left: -20 }}
					onPress={practiceId => {}}
				/>
			)}
			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.button}
				styleText={styles.buttonText}
				onPress={() => {}}
			>
				{Tools.i18n.t("1a2b0df6-fa67-4f71-8fd4-be1f0a576439")}
			</ColorButton>
		</DoubleColorView>
	);
};

export default PracticeListByType;

const styles = StyleSheet.create({
	descriptionType: {
		fontSize: height * 0.018,
		...Tools.gStyle.font("400"),
		textAlign: "center",
		color: "rgba(255, 255, 255, 0.8)",
		marginBottom: 17,
		marginTop: height * 0.0256,
	},
	background: {
		paddingHorizontal: 20,
		// justifyContent: "space-between",
		flex: 1,
	},
	carouselMeditation: {
		marginHorizontal: -20,
		marginTop: height * 0.004,
	},

	buttonStyle: {},
	buttonStyleText: {},
	informationMeditation: {
		transform: [{ translateY: 120 }],
	},
	button: {
		backgroundColor: "#C2A9CE",
		borderRadius: 15,
		width: "100%",
		height: 45,
		marginTop: 20,
		marginBottom: 30,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 14,
	},
	buttonInstruction: {
		width: "auto",
		alignSelf: "center",
		paddingHorizontal: 34,
		height: 30,
	},
	buttonTextInstruction: {
		color: "#FFFFFF",
		fontSize: 13,
		...Tools.gStyle.font("600"),
	},
});
