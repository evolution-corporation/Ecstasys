/** @format */

import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { DoubleColorView } from "~components/containers";
import core from "~core";
import { RootScreenProps } from "src/types";
import i18n from "~i18n";

import { useFavoriteMeditation } from "./hooks";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { useAppSelector } from "~store";

const FavoriteMeditationScreen: RootScreenProps<"FavoriteMeditation"> = ({ navigation }) => {
	const listFavoriteMeditation = useAppSelector(store => store.practice.listPracticesFavorite);

	const typesMeditation = React.useMemo(() => {
		const _typesMeditation: string[] = [];
		for (let meditation of listFavoriteMeditation) {
			if (!_typesMeditation.includes(meditation.type)) {
				_typesMeditation.push(meditation.type);
			}
		}

		return _typesMeditation;
	}, [listFavoriteMeditation]);

	return (
		<DoubleColorView style={styles.background} heightViewPart={140}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{typesMeditation.map((typeMeditation, index) => (
					<View key={typeMeditation} style={styles.favoriteTypeMeditationCard}>
						<Text style={[styles.typeName, { color: index === 0 ? "#FFFFFF" : "#3D3D3D" }]}>
							{i18n.t(
								typeMeditation == "DIRECTIONAL_VISUALIZATIONS"
									? "8566b563-b307-4943-ab52-d51c7e806a4c" : typeMeditation === "RELAXATION" ? "71277706-2f5d-4ce8-bf26-d680176d3fb8" : "c15d823e-8dd8-4eb7-b9f5-87c9845ac397"
							)}
						</Text>
						<FlatList
							data={listFavoriteMeditation.filter(meditation => meditation.type == typeMeditation)}
							keyExtractor={item => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={{ width: 140 }}
									onPress={() => {
										if (item.type === "RELAXATION") {
											navigation.navigate("SelectTimeForRelax", { selectedPractice: item });
										} else {
											navigation.navigate("PlayerForPractice", { selectedPractice: item });
										}
									}}
								>
									<Image source={{ uri: item.image }} style={styles.imageMeditation} />
									<Text style={styles.nameMeditation}>{item.name}</Text>
								</TouchableOpacity>
							)}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingHorizontal: 20,
							}}
							ItemSeparatorComponent={() => <View style={{ width: 27 }} />}
						/>
					</View>
				))}
			</ScrollView>
		</DoubleColorView>
	);
};

const styles = StyleSheet.create({
	background: {
		alignItems: "flex-start",
		flex: 1,
	},
	typeName: {
		fontSize: 20,
		...core.gStyle.font("600"),
		marginLeft: 30,
		marginBottom: 30,
	},
	meditationCard: {
		marginHorizontal: 13,
	},
	favoriteTypeMeditationCard: {
		marginBottom: 30,
	},
	nameMeditation: {
		color: "rgba(61, 61, 61, 1)",
		fontSize: 16,
		...core.gStyle.font("600"),
	},
	imageMeditation: {
		width: 140,
		height: 183,
		borderRadius: 20,
	},
});

export default FavoriteMeditationScreen;
