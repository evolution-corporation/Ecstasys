/** @format */

import React, { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Tools from "~core";
import { PracticesMeditation, RootScreenProps, State } from "~types";
import { CarouselPractices, ColorButton, IsFavorite } from "~components/dump";
import { DoubleColorView } from "~components/containers";
import i18n from "~i18n";
import DescriptionPrentices from "assets/descriptionPrentices.json";
import { actions, useAppDispatch } from "~store";
import { Converter, Request } from "~api";
import { SupportType } from "src/api/types";
import {
	MeditationOnTheCandle,
	MeditationOnTheMandala,
	MeditationOnTheNose,
	PlayerMeditationDot,
} from "src/baseMeditation";

import * as Instruction from "src/instruction";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import CarouselIcon from "assets/icons/CarouselIcon.svg";
import TreeLine from "assets/icons/bigThreeLine.svg";
import { useDimensions } from "@react-native-community/hooks";

var height = Dimensions.get("window").height;

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
				const listPractice: State.Practice[] = [
					{ ...MeditationOnTheNose, isPermission: true },
					{ ...PlayerMeditationDot, isPermission: true },
					{ ...MeditationOnTheMandala, isPermission: true },
					{ ...MeditationOnTheCandle, isPermission: true },
				];

				setPracticeList(listPractice);
				//! ----
			}
		};
		init();
	}, [isSubscribe]);

	const [typeShowScreen, setTypeShowScreen] = useState<"carousel" | "list">("list");

	const onClick = (practiceId: string) => {
		const practiceIndex = practiceList.findIndex(item => item.id === practiceId);
		if (practiceIndex !== -1) {
			if (practiceList[practiceIndex].isPermission) {
				const practice = Object.fromEntries(
					Object.entries(practiceList[practiceIndex]).filter(([key, value]) => key !== "isPermission")
				);
				dispatch(actions.setPractice(practiceList[practiceIndex]));
				if (typePractices === PracticesMeditation.BASIC) {
					navigation.navigate("SelectTimeForBase", { selectedPractice: practiceList[practiceIndex] });
				} else {
					navigation.navigate("SelectTimeForRelax", { selectedPractice: practiceList[practiceIndex] });
				}
			} else {
				navigation.navigate("ByMaySubscribe");
			}
		}
	};

	const subHeader = (
		<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
			<View style={{ width: 50 }} />
			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.buttonInstruction}
				styleText={styles.buttonTextInstruction}
				colors={["#75348B", "#6A2382"]}
				onPress={() => {
					const index = practiceList.findIndex(item => item.id == selectedPracticeId.current);

					if (typePractices === PracticesMeditation.RELAXATION) {
						navigation.navigate("Instruction", { instruction: Instruction.relaxation });
					} else if (typePractices === PracticesMeditation.DIRECTIONAL_VISUALIZATIONS) {
						navigation.navigate("Instruction", { instruction: Instruction.directionalVisualization });
					} else if (typePractices === PracticesMeditation.BASIC) {
						navigation.navigate("Instruction", { instruction: practiceList[index].instruction });
					} else {
						if (index !== -1)
							navigation.navigate("Instruction", {
								instruction: practiceList[index].instruction,
								meditationid: practiceList[index].id,
							});
					}
				}}
			>
				{i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750")}
			</ColorButton>
			{typePractices === "relaxation" || typePractices === "directionalVisualizations" ? (
				typeShowScreen === "carousel" ? (
					<Pressable key={"list"} onPress={() => setTypeShowScreen("list")} style={styles.changeType}>
						<TreeLine />
					</Pressable>
				) : (
					<Pressable key={"carousel"} onPress={() => setTypeShowScreen("carousel")} style={styles.changeType}>
						<CarouselIcon />
					</Pressable>
				)
			) : (
				<View style={styles.changeType} />
			)}
		</View>
	);

	const { window } = useDimensions();

	const [fVar, setFVar] = useState(0);

	if ((typePractices === "relaxation" || typePractices === "directionalVisualizations") && typeShowScreen === "list") {
		return (
			<DoubleColorView
				style={[styles.background, { height: window.height, paddingHorizontal: 0 }]}
				heightViewPart={150}
				hideElementVioletPart
				headerElement={
					<View style={{ top: 55, width: window.width, paddingHorizontal: 20 }}>
						{subHeader}
						<Text style={styles.descriptionType}>{i18n.t(DescriptionPrentices[route.params.typePractices])}</Text>
					</View>
				}
				onFunctionGetPaddingTop={getPaddingTop => {
					setFVar(getPaddingTop);
				}}
			>
				<FlatList
					data={practiceList}
					renderItem={({ item }) => (
						<Pressable
							style={{
								flexDirection: "row",
								width: "100%",
								marginVertical: 6,
								paddingHorizontal: 20,
							}}
							onPress={() => onClick(item.id)}
						>
							<Image
								source={{ uri: item.image }}
								style={{ width: 90, height: 90, borderRadius: 10, marginRight: 26 }}
							/>
							<View style={{ flex: 1 }}>
								<Text style={{ color: "#3D3D3D", fontSize: 16, ...Tools.gStyle.font("700"), marginBottom: 7 }}>
									{item.name}
								</Text>
								<Text style={{ color: "#9E9E9E", fontSize: 13, ...Tools.gStyle.font("600") }}>
									{i18n.t("minute", { count: Math.floor(item.length / 60000) })}
								</Text>
							</View>
							<View style={{ justifyContent: "center", alignItems: "center" }}>
								<IsFavorite practice={item} noShowWereNoFavorite />
							</View>
						</Pressable>
					)}
					keyExtractor={item => `practice-${item.id}`}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						marginTop: 40,
						paddingBottom: 40,
					}}
					style={{ marginTop: fVar }}
					ItemSeparatorComponent={() => (
						<View style={{ width: "100%", alignItems: "flex-end" }}>
							<View
								style={{
									height: 0,
									width: window.width - 122,
									borderColor: "rgba(231, 221, 236, 0.2)",
									borderWidth: 2,
									right: 0,
								}}
							/>
						</View>
					)}
				/>
			</DoubleColorView>
		);
	}

	return (
		<DoubleColorView style={styles.background} heightViewPart={height / 2 - 100}>
			{subHeader}
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
		width: "100%",
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
		backgroundColor: "#9765A8",
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
		borderRadius: 10,
	},
	buttonTextInstruction: {
		color: "#FFFFFF",
		fontSize: 13,
		...Tools.gStyle.font("600"),
	},
	changeType: {
		height: 50,
		width: 50,
		justifyContent: "center",
		alignItems: "center",
	},
});
