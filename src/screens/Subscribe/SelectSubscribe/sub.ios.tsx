/** @format */

import React, { useState } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { DoubleColorView } from "~components/containers";
import { ColorButton } from "~components/dump";
import i18n from "~i18n";
import gStyle from "~styles";

import { RootScreenProps, SubscribeType } from "~types";
import { SubscribeCard } from "./components";
import { actions, useAppDispatch, useAppSelector } from "~store";
import Group48095715 from "/Group48095715.svg";
import Vector from "/Vector.svg";
import BuySubscribeController from "../../../controllers/BuySubscribeController";
import * as InAppPurchases from "expo-in-app-purchases";
import { adapty } from "react-native-adapty";

const price = {
	month_1: 299,
	month_6: 1249,
};

const SelectSubscribeScreen: RootScreenProps<"SelectSubscribe"> = ({ navigation }) => {
	const [selectedSubscribeType, setSelectedSubscribeType] = useState<SubscribeType | null>(SubscribeType.MONTH);
	const [isAccept, setIsAccept] = useState<boolean>(false);
	// const modalRef = useRef<ElementRef<typeof CustomModal>>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const _transporteeYButton = useSharedValue(0);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			transform: [
				{
					translateY: withSpring(_transporteeYButton.value),
				},
			],
		})),
	};
	const appDispatch = useAppDispatch();
	const [isActiveSubs, subscribeEnd, isAutoPayment, subsType] = useAppSelector(store => {
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
			return [
				endSubscribe.getTime() > Date.now(),
				endSubscribe,
				store.account.subscribe.autoPayment,
				store.account.subscribe.type,
			];
		} else {
			return [false, null, null, null];
		}
	});
	// useEffect(() => {
	// 	if (
	// 		(selectedSubscribeType !== null && selectedSubscribeType !== subsType) ||
	// 		(subsType === null && selectedSubscribeType !== null) || (subsType !== null && !isActiveSubs)
	// 	) {
	// 		_transporteeYButton.value = 0;
	// 	}
	// }, [selectedSubscribeType, subsType,isActiveSubs]);

	const editSubscribe = async () => {
		try {
			if (selectedSubscribeType !== null && !isActiveSubs) {
				setIsLoading(true);
				const paywall = await adapty.getPaywall("subscribe.month.paywall");
				const products = await adapty.getPaywallProducts(paywall);
				await adapty.makePurchase(products[0]);
				setIsLoading(false);
				navigation.navigate("ResultSubscribeScreen", { status: "Designations" });
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			navigation.navigate("ResultSubscribeScreen", { status: "Fail" });
		}
	};

	return (
		<DoubleColorView heightViewPart={229} style={styles.background}>
			<View style={{ alignItems: "center" }}>
				{isActiveSubs && <Text style={styles.isHaveSubscribe}>{i18n.t("a14d438c-e101-4e6b-9757-74d7f388c97b")}</Text>}
				<AntDesign name="star" size={24} color={"#FBBC05"} />
				<Text style={styles.TitlePremium}>Premium</Text>
				<Text style={styles.currentMeditationInfo}>
					{subscribeEnd && isAutoPayment !== null && subscribeEnd >= new Date()
						? i18n.t(isAutoPayment ? "392fd6e3-9b0c-4673-b1c2-45deeaadd7b1" : "048d71cd-03e2-4c8f-9f29-d2e5e9576a07", {
								dateTime: i18n.strftime(subscribeEnd, "%d.%m.%Y"),
						  })
						: i18n.t("636763b2-80fc-4bd3-84ac-63c21cd34d77")}
				</Text>
				<SubscribeCard
					image={require("./assets/pillow.png")}
					isSelected={selectedSubscribeType === SubscribeType.MONTH}
					isUsed={isActiveSubs && subsType === "MONTH"}
					onPress={() => setSelectedSubscribeType(SubscribeType.MONTH)}
					price={price.month_1}
					stylesContent={{
						textStyle: { color: "#702D87" },
						background: { backgroundColor: "#F3F3F3" },
					}}
					mainColor={"#702D87"}
					countMonth={1}
					textPrice={{
						top: i18n.t("1d05ec08-f140-4774-b71b-7e1ce078cd94", {
							price: price.month_1,
						}),
						bottom: i18n.t("4415fe5e-bd86-41b1-91ca-5b20c685172b"),
					}}
					onCancelSubscribe={() => {}}
					isShowCancelButton={isAutoPayment ?? false}
					isFirstPayment={subscribeEnd === null}
				/>
			</View>
			<View>
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: 10,
					}}
				>
					<Pressable
						onPress={() => setIsAccept(prev => !prev)}
						style={{ width: 23, height: 23, justifyContent: "center", alignItems: "flex-start" }}
					>
						{isAccept ? <Group48095715 /> : <Vector />}
					</Pressable>
					<Text style={{ color: "#9E9E9E", fontSize: 13, ...gStyle.font("400"), marginLeft: 8, flex: 1 }}>
						Выбирая подписку, я соглашаюсь с{" "}
						<Text
							style={{ color: "#9765A8" }}
							onPress={() => Linking.openURL("https://evodigital.one/dmd_meditation/privacy")}
						>
							Условиями оферты о рекуррентных платежах
						</Text>{" "}
						и{" "}
						<Text
							style={{ color: "#9765A8" }}
							onPress={() => Linking.openURL("https://evodigital.one/dmd_meditation/privacy")}
						>
							Обработкой персональных данных
						</Text>
					</Text>
				</View>
				{!isActiveSubs && isLoading ? (
					<View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
						<ActivityIndicator color={"#C2A9CE"} />
					</View>
				) : (
					<ColorButton
						styleButton={[styles.button, isAccept ? {} : { backgroundColor: "#C2A9CE" }]}
						styleText={styles.buttonText}
						animationStyle={aStyle.button}
						onPress={() => {
							if (isAccept) editSubscribe();
						}}
					>
						{i18n.t("Arrange")}
					</ColorButton>
				)}
			</View>
		</DoubleColorView>
	);
};

export default SelectSubscribeScreen;

const styles = StyleSheet.create({
	TitlePremium: {
		color: "#FFFFFF",
		fontSize: 20,
		...gStyle.font("600"),
		marginBottom: 10,
	},

	price: {
		...gStyle.font("600"),
	},
	subscribeCard: {
		width: "100%",
		height: 150,
		justifyContent: "space-between",
		borderRadius: 20,
		padding: 12,
		flexDirection: "row",
		marginVertical: 9,
	},
	background: {
		paddingHorizontal: 20,
		justifyContent: "space-between",
		paddingBottom: 80,
	},
	month: {
		fontSize: 20,
		...gStyle.font("600"),
	},
	textPrice: {
		justifyContent: "space-between",
	},

	currentMeditationInfo: {
		color: "#E7DDEC",
		textAlign: "center",
		fontSize: 16,
		...gStyle.font("400"),
		width: "80%",
		marginBottom: 10,
	},

	isHaveSubscribe: {
		color: "#FFFFFF",
		fontSize: 20,
		...gStyle.font("600"),
		textAlign: "center",
		marginBottom: 12,
	},
	button: {
		backgroundColor: "#9765A8",
	},
	buttonText: {
		color: "#FFFFFF",
	},
	offerToChangeSubscribeType: {
		color: "#3D3D3D",
		fontSize: 16,
		...gStyle.font("600"),
		textAlign: "center",
		marginVertical: 20,
	},

	benefitPrice: {
		color: "#FBBC05",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 27,
		paddingVertical: 7,
		borderRadius: 15,
		fontSize: 13,
		...gStyle.font("600"),
		marginTop: 12,
	},
	informationMessage: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		paddingHorizontal: 40,
		paddingVertical: 47,
	},
	titleInformation: {
		color: "#3D3D3D",
		fontSize: 20,
		textAlign: "center",
	},
	messageInformation: {
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 14,
		...gStyle.font("400"),
		textAlign: "center",
		marginVertical: 24,
	},
	buttonModal: {
		backgroundColor: "#C2A9CE",
	},
	buttonModalText: {
		color: "#FFFFFF",
	},
});
