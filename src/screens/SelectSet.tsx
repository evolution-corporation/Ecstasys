/** @format */

import React, { useCallback } from "react";
import { Image, Text, StyleSheet, View, Pressable, FlatList, useWindowDimensions } from "react-native";
import { RootScreenProps, State } from "~types";
import DoubleColorView, {
	heightViewPart2 as DoubleColorViewHeightViewPart2,
	heightViewPart2,
} from "~components/containers/DoubleColorView";
import { SharedElement } from "react-navigation-shared-element";
import gStyle from "~styles";
import { actions, useAppDispatch } from "~store";
import i18n from "~i18n";
import Repeat from "assets/icons/Repeat.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { Converter, Request } from "~api";
import Play from "assets/icons/PlayWhite.svg";
import { ColorButton } from "~components/dump";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useDimensions} from "@react-native-community/hooks";

const SelectSet: RootScreenProps<"SelectSet"> = ({ navigation, route }) => {
	const { selectedRelax } = route.params;
	const [setList, setSetList] = React.useState<State.Set[]>([]);
	const [selectedSetIndex, setSelectedSetIndex] = React.useState<number | null>(0);
	const { window: { width, height } } = useDimensions()
	const appDispatch = useAppDispatch();
	useFocusEffect(
		useCallback(() => {
			(async () => {
				setSetList(
					/*@ts-ignore */
					(await Request.getMeditationsByType("set"))
						/*@ts-ignore */
						.map(item => Converter.composeSet(item))
						.filter(item => item !== null)
				);
			})();
		}, [])
	);
	const insets = useSafeAreaInsets();

	return (
		<DoubleColorView heightViewPart={133} hideElementVioletPart>
			<View style={[styles.header, { top: insets.top + 55 }]}>
				<View style={styles.informationPractice}>
					<SharedElement id={`practice.item.${selectedRelax.id}`} style={styles.image}>
						<Image source={{ uri: selectedRelax.image }} style={{ width: "100%", height: "100%", borderRadius: 20 }} />
					</SharedElement>
					<View style={{ marginLeft: 14, justifyContent: "space-between", marginRight: 50 }}>
						<Text style={styles.title}>{selectedRelax.name}</Text>
						<Text style={styles.time}>
							{i18n.t("minute", {
								count: Math.floor(selectedRelax.length / 60000),
							})}
						</Text>
					</View>
				</View>
				<Text style={[styles.title, { alignSelf: "center", marginBottom: 14 }]}>
					{i18n.t("93ab238f-1789-4bea-96fd-b98e9dfa5e60")}
				</Text>
				<Pressable
					style={{ top: -6, marginLeft: 15 }}
					onPress={() => {
						const index = Math.floor(Math.random() * setList.length);
						if (height >= 815) {
							setSelectedSetIndex(index);
						} else {
							appDispatch(actions.setSetForDMD(setList[index]));
							navigation.navigate("DMDSettingNotification", { selectedRelax, selectSet: setList[index] });
						}
					}}
				>
					<LinearGradient colors={["#75348B", "#6A2382"]} style={styles.randomButton}>
						<Repeat />
					</LinearGradient>
				</Pressable>
			</View>
			<FlatList
				data={setList}
				style={{ width, top: 133 }}
				renderItem={({ item, index }) => (
					<Pressable
						style={[
							styles.renderElement,
							selectedSetIndex === index && height >= 815 ? { backgroundColor: "#E7DDEC" } : null,
						]}
						onPress={() => {
							if (height >= 815) {
								setSelectedSetIndex(index);
							} else {
								appDispatch(actions.setSetForDMD(setList[index]));
								navigation.navigate("DMDSettingNotification", { selectedRelax, selectSet: setList[index] });
							}
						}}
					>
						<View style={[{ flexDirection: "row", alignItems: "center" }]}>
							{selectedSetIndex === index && height >= 815 ? (
								<View
									style={{
										width: 56,
										height: 56,
										borderRadius: 28,
										backgroundColor: "#C2A9CE",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Play width={26} height={26} />
								</View>
							) : (
								<View
									style={{
										width: 56,
										height: 56,
										borderRadius: 28,
										backgroundColor: "#E6E6E6",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text
										style={{
											color: "#606060",
											backgroundColor: "#E6E6E6",
											fontSize: 18,
											...gStyle.font("600"),
										}}
									>
										{index + 1}
									</Text>
								</View>
							)}
							<Text style={styles.nameSet}>{item.name}</Text>
						</View>
						<Text style={styles.timeSet}>
							{i18n.t("minute", {
								count: Math.floor(item.length / 60000),
							})}
						</Text>
					</Pressable>
				)}
				keyExtractor={item => item.id}
				contentContainerStyle={{ paddingTop: heightViewPart2 + 21, paddingBottom: 200 }}
				showsVerticalScrollIndicator={false}
			/>

		</DoubleColorView>
	);
};

const styles = StyleSheet.create({
	informationPractice: {
		flexDirection: "row",
		width: "100%",
		height: 65,
	},
	image: {
		width: 65,
		height: 65,
		borderRadius: 20,
		overflow: "hidden",
	},
	title: {
		color: "#FFFFFF",
		fontSize: 16,
		...gStyle.font("700"),
	},
	time: {
		fontSize: 13,
		color: "#FFFFFF",
		opacity: 0.5,
		...gStyle.font("400"),
	},
	randomButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		...gStyle.shadows(1, 5),
		justifyContent: "center",
		alignItems: "center",
	},
	nameSet: {
		marginLeft: 16,
		fontSize: 16,
		color: "#3D3D3D",
		...gStyle.font("400"),
	},
	number: {
		width: 56,
		height: 56,
		borderRadius: 28,
		color: "#606060",
		backgroundColor: "#E6E6E6",
		fontSize: 18,
		...gStyle.font("600"),
		textAlignVertical: "center",
		textAlign: "center",
	},
	timeSet: {
		color: "#3D3D3D",
		fontSize: 13,
		...gStyle.font("400"),
		opacity: 0.5,
	},
	header: {
		height: 133 + heightViewPart2,
		justifyContent: "space-between",
		zIndex: 11,
		position: "absolute",
		width: "100%",
		paddingHorizontal: 20,
	},
	renderElement: {
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		paddingHorizontal: 30,
		paddingVertical: 6,
	},
	continueButton: {
		position: "absolute",
		bottom: 45,
		backgroundColor: "#C2A9CE",
		borderRadius: 15,
		left: 20,
		right: 20,
	},
	continueButtonText: {
		fontSize: 14,
		color: "#FFFFFF",
		...gStyle.font("500"),
	},
});

export default SelectSet;
