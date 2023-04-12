/** @format */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Dimensions,
	Image,
	ImageSourcePropType,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import i18n from "~i18n";
import gStyle from "~styles";
import { DoubleColorView } from "~components/containers";
import Tools from "~core";
import { GeneralCompositeScreenProps, PracticesMeditation } from "~types";
import { CategoryCard, UserButton } from "~components/dump";
import { Request, Storage } from "~api";
import { useFocusEffect } from "@react-navigation/native";

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

const PracticesMeditationList: GeneralCompositeScreenProps = ({ navigation }) => {
	const [countPractices, setCountPractices] = useState<{ [key: string]: number | null }>({
		basic: null,
		relaxation: null,
		breathingPractices: null,
		directionalVisualizations: null,
	});

	const [getPaddingTopFunction, setGetPaddingTopFunction] = useState<{
		f: (width: number) => number;
	} | null>(null);
	const [widthTitle, setWidthTitle] = useState<number | null>(null);

	const topPaddingContent = useMemo(() => {
		if (!getPaddingTopFunction || !widthTitle) return null;
		return getPaddingTopFunction.f(widthTitle);
	}, [getPaddingTopFunction, widthTitle]);

	const refFlatList = useRef<FlatList>(null);
	useEffect(() => {
		const counts = Promise.all([
			Request.getCountMeditationsByType("relaxation"),
			// setCountPractices(preValue => ({ ...preValue, relaxation: count }))
			Request.getCountMeditationsByType("directionalVisualizations"),
			Request.getCountMeditationsByType("breathtakingPractice"),
		]);
		counts.then(countsResult => {
			setCountPractices(preValue => ({
				...preValue,
				relaxation: countsResult[0],
				directionalVisualizations: countsResult[1],
				breathingPractices: countsResult[2],
				basic: 4,
			}));
		});
	}, []);

	//! BUG
	useFocusEffect(
		useCallback(() => {
			const init = async () => {
				const result = await Storage.getStatusShowGreetingScreens();
				console.log({ status: result.DescriptionPractices });
				if (!result.DescriptionPractices) {
					navigation.navigate("IntroPractices");
				}
			};
			init();
		}, [])
	);
	//!

	const categoryView = CategoryMeditation.filter(item => countPractices[item.id] > 0);
	return (
		<DoubleColorView
			onFunctionGetPaddingTop={getPaddingTop => {
				setGetPaddingTopFunction({ f: getPaddingTop });
			}}
			hideElementVioletPart
			headerElement={
				<View
					style={{
						position: "absolute",
						width: "100%",
						left: 0,
						right: 0,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: 20,
					}}
				>
					<Text style={{ ...gStyle.styles.header, color: "#FFF", width: "auto" }}>
						{i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05")}
					</Text>
					<UserButton onPress={() => navigation.navigate("Profile")} />
				</View>
			}
		>
			<View
				style={{
					position: "absolute",
					width: "100%",
					left: 0,
					top: -50,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					zIndex: 1000,
					paddingHorizontal: 20,
				}}
			>
				<Text style={{ ...gStyle.styles.header, color: "#FFFFFF", width: "auto" }}>
					{i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05")}
				</Text>
				<UserButton onPress={() => navigation.navigate("Profile")} />
			</View>
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
				{categoryView.length > 0 && (
					<FlatList
						ref={refFlatList}
						data={categoryView}
						initialScrollIndex={0}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => navigation.navigate("PracticeListByType", { typePractices: item.id })}>
								<View style={{ width: 110, alignItems: "center" }}>
									<Image source={item.image} style={styles.imageSmall} />
									<Text style={styles.textNameSmall}>{i18n.t(item.name)}</Text>
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
				)}

				<View style={[styles.listFull, { top: -11 }]}>
					{categoryView.map((item, index) => (
						<CategoryCard
							key={item.id}
							count={countPractices[item.id]}
							description={i18n.t(item.description)}
							image={item.image}
							name={i18n.t(item.name)}
							onPress={() => navigation.navigate("PracticeListByType", { typePractices: item.id })}
							style={{ marginVertical: 11 }}
						/>
					))}
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
		width: 110,
		height: 110,
		borderRadius: 10,
	},
	title: {
		color: "#9765A8",
		fontSize: 24,
		...Tools.gStyle.font("600"),
		alignSelf: "flex-start",
	},
	textNameSmall: {
		color: "#3d3d3d",
		fontSize: 14,
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

export default PracticesMeditationList;
