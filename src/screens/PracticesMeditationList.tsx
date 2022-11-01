/** @format */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
	View,
	ScrollView,
	ImageSourcePropType,
	Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import i18n from "~i18n";

import { DoubleColorView } from "~components/containers";
import Tools from "~core";
import { GeneralCompositeScreenProps, PracticesMeditation } from "~types";
import { CategoryCard } from "~components/dump";
import { Request, Storage } from "~api";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";

const PracticesMeditationList: GeneralCompositeScreenProps = ({ navigation }) => {
	const [countPractices, setCountPractices] = useState<{ [key: string]: number | null }>({
		basic: null,
		relaxation: null,
		breathingPractices: null,
		directionalVisualizations: null,
	});
	const [getPaddingTopFunc, setGetPaddingTopFunc] = useState<{
		f: (width: number) => number;
	} | null>(null);
	const [widthTitle, setWidthTitle] = useState<number | null>(null);

	const topPaddingContent = useMemo(() => {
		if (!getPaddingTopFunc || !widthTitle) return null;
		return getPaddingTopFunc.f(widthTitle);
	}, [getPaddingTopFunc, widthTitle]);

	const refFlatList = useRef<FlatList>(null);

	useEffect(() => {
		(async => {
			Promise.all([
				Request.getCountMeditationsByType("relaxation").then(count =>
					setCountPractices(preValue => ({ ...preValue, relaxation: count }))
				),
				Request.getCountMeditationsByType("breathtakingPractice").then(count =>
					setCountPractices(preValue => ({ ...preValue, breathingPractices: count }))
				),
				Request.getCountMeditationsByType("directionalVisualizations").then(count =>
					setCountPractices(preValue => ({ ...preValue, directionalVisualizations: count }))
				),
			]);
		})();
	}, []);

	useFocusEffect(
		useCallback(() => {
			const init = async () => {
				const result = await Storage.getStatusShowGreetingScreens();
				console.log(result);
				if (!result.DescriptionPractices) {
					navigation.navigate("IntroPractices");
				}
			};
			init();
		}, [])
	);

	return (
		<DoubleColorView
			onFunctionGetPaddingTop={getPaddingTop => {
				setGetPaddingTopFunc({ f: getPaddingTop });
			}}
			hideElementVioletPart
		>
			<StatusBar style="light" backgroundColor="#9765A8" hidden={false} />

			<ScrollView
				contentContainerStyle={[topPaddingContent ? { paddingTop: topPaddingContent } : null, styles.background]}
				showsVerticalScrollIndicator={false}
			>
				<Text
					style={[styles.title]}
					onLayout={({ nativeEvent: { layout } }) => {
						if (!widthTitle) setWidthTitle(layout.width);
					}}
				>
					{i18n.t("db8e7216-be7c-4ecc-8ddd-0cf9ff83f419")}
				</Text>
				<FlatList
					ref={refFlatList}
					data={CategoryMeditation}
					initialScrollIndex={0}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => navigation.navigate("PracticeListByType", { typePractices: item.id })}>
							<View style={{ width: 92, height: 140 }}>
								<Image source={item.image} style={styles.imageSmall} />
								<Text style={styles.textNameSmall} adjustsFontSizeToFit>
									{i18n.t(item.name)}
								</Text>
							</View>
						</TouchableOpacity>
					)}
					keyExtractor={item => `${item.id}_small`}
					horizontal={true}
					ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
					style={styles.fastList}
					contentContainerStyle={{ paddingHorizontal: 20 }}
					showsHorizontalScrollIndicator={false}
				/>
				<View style={styles.listFull}>
					{CategoryMeditation.map((item, index) => {
						return (
							<CategoryCard
								key={item.id}
								count={countPractices[item.id]}
								description={i18n.t(item.description)}
								image={item.image}
								name={i18n.t(item.name)}
								onPress={() => navigation.navigate("PracticeListByType", { typePractices: item.id })}
								style={{ marginVertical: 11 }}
							/>
						);
					})}
				</View>
			</ScrollView>
		</DoubleColorView>
	);
};

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	imageSmall: {
		width: 92,
		height: 92,
		borderRadius: 10,
	},
	title: {
		color: "rgba(112, 45, 135, 1)",
		fontSize: 24,
		...Tools.gStyle.font("600"),
		alignSelf: "flex-start",
	},
	textNameSmall: {
		color: "rgba(112, 45, 135, 1)",
		fontSize: 13,
		textAlign: "center",
		...Tools.gStyle.font("400"),
		width: "100%",
	},
	listFull: {
		width: "100%",
	},
	fastList: {
		marginVertical: 20,
		left: -20,
		right: -20,
		width: Dimensions.get("window").width,
	},
});

const CategoryMeditation: {
	name: string;
	image: ImageSourcePropType;
	description: string;
	id: PracticesMeditation;
}[] = [
	{
		name: "71277706-2f5d-4ce8-bf26-d680176d3fb8",
		image: require("assets/practicesImage/relaxation.png"),
		description: "ec0c8421-03d1-4755-956d-66a84d81d74a",
		id: PracticesMeditation.RELAXATION,
	},
	{
		name: "8566b563-b307-4943-ab52-d51c7e806a4c",
		image: require("assets/practicesImage/directionalVisualizations.png"),
		description: "bb340c18-2a8b-4b7b-8250-80a865dca9b4",
		id: PracticesMeditation.DIRECTIONAL_VISUALIZATIONS,
	},
	{
		name: "c15d823e-8dd8-4eb7-b9f5-87c9845ac397",
		image: require("assets/practicesImage/breathingPractices.png"),
		description: "c54bff96-21eb-4f10-8ad6-090e06f2eef9",
		id: PracticesMeditation.BREATHING_PRACTICES,
	},
	{
		name: "0d63a21e-eecc-45cc-9085-86b97c88d713",
		image: require("assets/practicesImage/basic.png"),
		description: "ef09ec88-afda-4fef-b68b-02b433919e50",
		id: PracticesMeditation.BASIC,
	},
];

export default PracticesMeditationList;
