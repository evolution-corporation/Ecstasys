/** @format */

import React, { useState } from "react";
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { DoubleColorView } from "~components/containers";
import { ColorButton } from "~components/dump";
import i18n from "~i18n";
import gStyle from "~styles";

import { RootScreenProps, SubscribeType } from "~types";
import { SubscribeCard } from "./components";
import { useAppDispatch, useAppSelector } from "~store";
import Group48095715 from "/Group48095715.svg";
import Vector from "/Vector.svg";
import { adapty } from "react-native-adapty";
import { useDimensions } from "@react-native-community/hooks";

const price = {
	month_1: 299,
	month_6: 1290,
};

const aliasId: { [key: string]: string } = {
	MONTH: "subscription.monthly",
	HALF_YEAR: "subscription.halfyear",
};

const SelectSubscribeScreen: RootScreenProps<"SelectSubscribe"> = ({ navigation }) => {
	const [selectedSubscribeType, setSelectedSubscribeType] = useState<SubscribeType | null>(SubscribeType.MONTH);
	const [isAccept, setIsAccept] = useState<boolean>(false);
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

	const editSubscribe = async () => {
		try {
			if (selectedSubscribeType !== null && !isActiveSubs) {
				setIsLoading(true);
				const paywall = await adapty.getPaywall("buy_my_subscribe");
				const products = await adapty.getPaywallProducts(paywall);
				const name = selectedSubscribeType as string;

				for (const product of products) {
					if (product.vendorProductId === aliasId[name]) {
						await adapty.makePurchase(product);
						break;
					}
				}

				setIsLoading(false);
				navigation.navigate("ResultSubscribeScreen", { status: "Designations" });
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			navigation.navigate("ResultSubscribeScreen", { status: "Fail" });
		}
	};

	const { window } = useDimensions();

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
				<FlatList
					data={[
						{
							image: require("./assets/pillow.png"),
							type: SubscribeType.MONTH,
							name: "MONTH",
							price: price.month_1,
							textColor: "#702D87",
							backgroundColor: "#F3F3F3",
							mainColor: "#702D87",
							countMonth: 1,
							textTop: i18n.t("1d05ec08-f140-4774-b71b-7e1ce078cd94", {
								price: price.month_1,
							}),
							textBottom: i18n.t("4415fe5e-bd86-41b1-91ca-5b20c685172b"),
						},
						{
							image: require("./assets/armchair.png"),
							type: SubscribeType.HALF_YEAR,
							name: "HALF_YEAR",
							price: price.month_6,
							textColor: "#FFF",
							backgroundColor: "#702D87",
							mainColor: "#FFF",
							countMonth: 6,
							textTop: i18n.t("56b57ad2-f5f3-4f05-9f43-55d2edb25bdf", {
								price: price.month_6,
							}),
							textBottom: i18n.t("84fe380b-74a9-4d02-9463-550c2d746617"),
						},
					]}
					renderItem={({ item }) => (
						<View style={{ width: window.width - 40 }}>
							<SubscribeCard
								image={item.image}
								isSelected={selectedSubscribeType === item.type}
								isUsed={isActiveSubs && subsType === item.name}
								onPress={() => setSelectedSubscribeType(item.type)}
								price={item.price}
								stylesContent={{
									textStyle: { color: item.textColor },
									background: { backgroundColor: item.backgroundColor },
								}}
								mainColor={item.mainColor}
								countMonth={item.countMonth}
								textPrice={{
									top: item.textTop,
									bottom: item.textBottom,
								}}
								onCancelSubscribe={() => {}}
								isShowCancelButton={isAutoPayment ?? false}
								isFirstPayment={subscribeEnd === null}
							/>
						</View>
					)}
					keyExtractor={item => `Key-${item.name}`}
					style={{
						left: 0,
						right: 0,
						width: window.width,
					}}
					contentContainerStyle={{ paddingHorizontal: 20 }}
					horizontal={window.height <= 600}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					snapToInterval={window.height <= 600 ? window.width : undefined}
					pagingEnabled
					disableIntervalMomentum
					ItemSeparatorComponent={() => <View style={{ width: 40, height: 20 }} />}
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
