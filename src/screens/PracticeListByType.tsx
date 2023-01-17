/** @format */

import React, { useState } from "react";
import { Text, StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Tools from "~core";
import { PracticesMeditation, RootScreenProps, State } from "~types";
var height = Dimensions.get("window").height;

import { ColorButton } from "~components/dump";
import { DoubleColorView } from "~components/containers";
import i18n from "~i18n";
import DescriptionPrentices from "assets/descriptionPrentices.json";
import { CarouselPractices } from "~components/dump";
import { actions, useAppDispatch } from "~store";
import { Converter, Request } from "~api";
import { SupportType } from "src/api/types";
import { MeditationOnTheMandala, MeditationOnTheNose, PlayerMeditationDot } from "src/baseMeditation";

import * as Instruction from "src/instruction";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import useExperimentalFunction from "src/hooks/use-experimental-function";
import {useDimensions} from "@react-native-community/hooks";

const PracticeListByType: RootScreenProps<"PracticeListByType"> = ({ route, navigation }) => {
	const { typePractices } = route.params;
	const selectedPracticeId = React.useRef<string | null>(null);
	const [practiceList, setPracticeList] = useState<State.Practice[]>([]);
	const dispatch = useAppDispatch();
	const opacityButton = useSharedValue(1);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			opacity: withTiming(opacityButton.value),
		})),
	};
	const isSubscribe = useIsActivateSubscribe();

	//! Experimental
	const DotMeditation = useExperimentalFunction("baseMeditation_dotMeditation");
	const mandalaMeditation = useExperimentalFunction("baseMeditation_mandalaMeditation");
	const noseMeditation = useExperimentalFunction("baseMeditation_noseMeditation");
	//! ---
	React.useLayoutEffect(() => {
		navigation.setOptions({ title: i18n.t(typePractices) });
		const init = async () => {
			if (typePractices !== PracticesMeditation.BASIC) {
				let typePractice: SupportType.TypeMeditation;
				switch (typePractices) {
					case PracticesMeditation.RELAXATION:
						typePractice = "relaxation";
						break;
					case PracticesMeditation.BREATHING_PRACTICES:
						typePractice = "breathtakingPractice";
						break;
					case PracticesMeditation.DANCE_PSYCHOTECHNICS:
						typePractice = "dancePsychotechnics";
						break;
					case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
						typePractice = "directionalVisualizations";
						break;
					default:
						throw new Error("Not found Type");
				}
				const newListPractice = (await Request.getMeditationsByType(typePractice))
					.map(practice => Converter.composePractice(practice))
					.filter(practice => practice !== null) as State.Practice[];
				setPracticeList([
					...newListPractice.map(item => ({ ...item, isPermission: item.isNeedSubscribe ? isSubscribe : true })),
				]);
			} else {
				//! Experimental
				const listPractice: State.Practice[] = [];
				console.log("test");
				if (DotMeditation.status) listPractice.push({ ...PlayerMeditationDot, isPermission: true });
				if (mandalaMeditation.status) listPractice.push({ ...MeditationOnTheMandala, isPermission: true });
				if (noseMeditation.status) listPractice.push({ ...MeditationOnTheNose, isPermission: true });
				setPracticeList(listPractice);
				//! ----
			}
		};
		init();
	}, [isSubscribe]);
	const onClick = (practiceId: string) => {
		const practiceIndex = practiceList.findIndex(item => item.id === practiceId);
		if (practiceIndex !== -1) {
			if (practiceList[practiceIndex].isPermission) {
				const practice = Object.fromEntries(
					Object.entries(practiceList[practiceIndex]).filter(([key, value]) => key !== "isPermission")
				);
				dispatch(actions.setPractice(practiceList[practiceIndex]));
				if (practiceList[practiceIndex].type === "RELAXATION") {
					navigation.navigate("SelectTimeForRelax", { selectedPractice: practiceList[practiceIndex] });
				} else if (typePractices === PracticesMeditation.BASIC) {
					navigation.navigate("SelectTimeForBase", { selectedPractice: practiceList[practiceIndex] });
				} else {
					navigation.navigate("PlayerForPractice", {
						practiceLength: practiceList[practiceIndex].length,
						selectedPractice: practiceList[practiceIndex],
					});
				}
			} else {
				navigation.navigate("ByMaySubscribe");
			}
		}
	};
	return (
		<DoubleColorView style={styles.background} heightViewPart={height / 2 - 100}>
			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.buttonInstruction}
				styleText={styles.buttonTextInstruction}
				colors={["#75348B", "#6A2382"]}
				onPress={() => {
					if (typePractices === PracticesMeditation.RELAXATION) {
						navigation.navigate("Instruction", { instruction: Instruction.relaxation });
					} else if (typePractices === PracticesMeditation.DIRECTIONAL_VISUALIZATIONS) {
						navigation.navigate("Instruction", { instruction: Instruction.directionalVisualization });
					} else {
						const index = practiceList.findIndex(item => item.id == selectedPracticeId.current);
						if (index !== -1) navigation.navigate("Instruction", { instruction: practiceList[index].instruction });
					}
				}}
			>
				{i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750")}
			</ColorButton>
			<Text style={styles.descriptionType}>{i18n.t(DescriptionPrentices[route.params.typePractices])}</Text>
			{practiceList.length > 0 && (
				<CarouselPractices
					data={practiceList}
					style={{ width: Dimensions.get("window").width, left: -20 }}
					onPress={onClick}
					onChange={(practiceId: string | null) => {
						selectedPracticeId.current = practiceId;
					}}
				/>
			)}
			{height >= 815 && (
				<ColorButton
					animationStyle={aStyle.button}
					styleButton={styles.button}
					styleText={styles.buttonText}
					onPress={() => {
						if (selectedPracticeId.current !== null) onClick(selectedPracticeId.current);
					}}
				>
					{i18n.t("1a2b0df6-fa67-4f71-8fd4-be1f0a576439")}
				</ColorButton>
			)}
		</DoubleColorView>
	);
};

export default PracticeListByType;

const styles = StyleSheet.create({
	descriptionType: {
		fontSize: 14, //height * 0.018,
		...Tools.gStyle.font("400"),
		textAlign: "center",
		color: "rgba(255, 255, 255, 1)",
		marginBottom: 11,
		marginTop: 11, //height * 0.0256,
	},
	background: {
		paddingHorizontal: 20,
		justifyContent: "space-between",
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
		marginHorizontal: 20
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
		borderRadius: 10,
	},
	buttonTextInstruction: {
		color: "#FFFFFF",
		fontSize: 13,
		...Tools.gStyle.font("600"),
	},
});
