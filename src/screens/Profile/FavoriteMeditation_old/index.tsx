/** @format */

import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { DoubleColorView } from "~components/containers";
import core from "~core";
import { RootScreenProps } from "src/types";
import i18n from "~i18n";

import { useFavoriteMeditation } from "./hooks";
import { StatusBar } from "expo-status-bar";

const FavoriteMeditationScreen: RootScreenProps<"FavoriteMeditation"> = ({ navigation }) => {
	const { listFavoriteMeditation, typesMeditation } = useFavoriteMeditation();

	return (
		<DoubleColorView style={styles.background} heightViewPart={140}>
			<StatusBar style="light" backgroundColor="#9765A8" hidden={false} />
			<ScrollView showsVerticalScrollIndicator={false}>
				{typesMeditation.map((typeMeditation, index) => (
					<View key={typeMeditation} style={styles.favoriteTypeMeditationCard}>
						<Text style={[styles.typeName, { color: index === 0 ? "#FFFFFF" : "#3D3D3D" }]}>
							{i18n.t(typeMeditation)}
						</Text>
						<FlatList
							data={listFavoriteMeditation.filter(meditation => meditation.category == typeMeditation)}
							keyExtractor={item => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={{ width: 140 }}
									onPress={() => {
										navigation.navigate("ListenMeditation", {
											meditationId: item.id,
										});
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
