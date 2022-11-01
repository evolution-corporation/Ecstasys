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
import { StatusBar } from "expo-status-bar";

const PracticeListByType: RootScreenProps<"PracticeListByType"> = ({ route, navigation }) => {
	const { typePractices } = route.params;
	const { height } = useWindowDimensions();
	const selectedPracticeId = React.useRef<string | null>(null);
	const [practiceList, setPracticeList] = useState<State.Practice[]>([]);
	const dispatch = useAppDispatch();
	const opacityButton = useSharedValue(1);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			opacity: withTiming(opacityButton.value),
		})),
	};

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
				setPracticeList([...newListPractice]);
			}
		};
		init();
	}, []);
	const onClick = (practiceId: string) => {
		const practiceIndex = practiceList.findIndex(item => item.id === practiceId);
		if (practiceIndex !== -1) {
			dispatch(actions.setPractice(practiceList[practiceIndex]));
			if (practiceList[practiceIndex].type === "RELAXATION") {
				navigation.navigate("SelectTimeForRelax", { selectedPractice: practiceList[practiceIndex] });
			} else {
				navigation.navigate("PlayerForPractice", {
					practiceLength: practiceList[practiceIndex].length,
					selectedPractice: practiceList[practiceIndex],
				});
			}
		}
	};
	return (
		<DoubleColorView style={styles.background} heightViewPart={height / 2 - 100}>
			<StatusBar style="light" backgroundColor="#9765A8" hidden={false} />

			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.buttonInstruction}
				styleText={styles.buttonTextInstruction}
				colors={["#75348B", "#6A2382"]}
				onPress={() => {}}
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
			{height >= 800 && (
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
		fontSize: height * 0.018,
		...Tools.gStyle.font("400"),
		textAlign: "center",
		color: "rgba(255, 255, 255, 0.8)",
		marginBottom: 17,
		marginTop: height * 0.0256,
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
