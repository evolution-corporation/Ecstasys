/** @format */

import React, { useCallback, useState } from "react";
import { Text, StyleSheet, useWindowDimensions, Dimensions, View } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Tools from "~core";
import { GeneralCompositeScreenProps, State, TabNavigatorScreenProps } from "~types";
var height = Dimensions.get("window").height;

import { ColorButton, UserButton } from "~components/dump";
import { DoubleColorView } from "~components/containers";
import i18n from "~i18n";
import { CarouselPractices } from "~components/dump";
import { useFocusEffect } from "@react-navigation/native";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { Converter, Request, Storage } from "~api";
import { StatusBar } from "expo-status-bar";
import gStyle from "~styles";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import { developmentConfig } from "src/read-config";

const RelaxListForDMD: GeneralCompositeScreenProps = ({ route, navigation }) => {
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
	const isSubscribe = developmentConfig("customHook")
		? useIsActivateSubscribe()
		: useAppSelector(store => {
				if (store.account.subscribe !== undefined) {
					const endSubscribe = new Date(store.account.subscribe.whenSubscribe);

					endSubscribe.setDate(
						endSubscribe.getDate() +
							(() => {
								switch (store.account.subscribe.type) {
									case "WEEK":
										return 7;
									case "MONTH":
										return 30;
									case "HALF_YEAR":
										return 180;
									default:
										return 0;
								}
							})()
					);
					return endSubscribe.getTime() > Date.now();
				} else {
					return false;
				}
		  });
	useFocusEffect(
		useCallback(() => {
			(async () => {
				const newListPractice = (await Request.getMeditationsByType("relaxation"))
					.map(practice => Converter.composePractice(practice))
					.filter(practice => practice !== null) as State.Practice[];
				setPracticeList(newListPractice.map(item => ({ ...item, isPermission: isSubscribe })));
			})();
		}, [isSubscribe])
	);

	const onClick = (practiceId: string) => {
		const practiceIndex = practiceList.findIndex(item => item.id === practiceId);
		if (practiceIndex !== -1 && practiceList[practiceIndex].type === "RELAXATION" && isSubscribe) {
			dispatch(actions.setOptionForDMD(practiceList[practiceIndex]));
			navigation.navigate("SelectSet", { selectedRelax: practiceList[practiceIndex] });
		}
	};

	useFocusEffect(
		useCallback(() => {
			const init = async () => {
				const result = await Storage.getStatusShowGreetingScreens();
				if (!result.DescriptionDMD) {
					navigation.navigate("DMDIntro");
				}
			};
			init();
		}, [])
	);

	return (
		<DoubleColorView
			style={styles.background}
			heightViewPart={height / 2 - 100}
			headerElement={
				<View
					style={{
						position: "absolute",
						width: "100%",
						left: 20,
						right: 0,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: 0,
					}}
				>
					<Text style={{ ...gStyle.styles.header, color: "#FFFFFF", width: "auto" }}>{i18n.t("DMD")}</Text>
					<UserButton onPress={() => navigation.navigate("Profile")} />
				</View>
			}
		>
			<ColorButton
				animationStyle={aStyle.button}
				styleButton={styles.buttonInstruction}
				styleText={styles.buttonTextInstruction}
				colors={["#75348B", "#6A2382"]}
				onPress={() => {}}
			>
				{i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750")}
			</ColorButton>
			<Text style={styles.descriptionType}>{i18n.t("8788c798-fdc1-444a-865f-4c07b63be00a")}</Text>
			{practiceList.length > 0 && (
				<CarouselPractices
					data={practiceList}
					isNoShowFavorite
					style={{ width: Dimensions.get("window").width, left: -20 }}
					onPress={practiceId => {
						onClick(practiceId);
					}}
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

export default RelaxListForDMD;

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
