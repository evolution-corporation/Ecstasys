/** @format */

import React, { ElementRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { CustomModal, DoubleColorView } from "~components/containers";
import { ColorButton } from "~components/dump";
import Tools from "~core";

import { typeSubscribe } from "./types";
import { SubscribeCard } from "./components";
import { useSubscribe } from "~modules/subscribe";
import { SubscribeInfoNew } from "~modules/subscribe/types";

const price = {
	month_1: 279,
	month_6: 1179,
};

const SelectSubscribeScreen = () => {
	const subscribeInformation = useSubscribe();
	let info: SubscribeInfoNew | undefined;
	if (subscribeInformation) {
		info = subscribeInformation.info;
	}
	const [selectedSubscribe, setSelectedSubscribe] = useState<typeSubscribe>(null);

	const modalRef = useRef<ElementRef<typeof CustomModal>>(null);

	const _transpareteYButton = useSharedValue(300);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			transform: [
				{
					translateY: withSpring(_transpareteYButton.value),
				},
			],
		})),
	};

	useEffect(() => {
		if (selectedSubscribe !== null && selectedSubscribe !== info?.type) {
			_transpareteYButton.value = 0;
		}
	}, [selectedSubscribe]);

	const isActiveSubs = (info && info.nextPayment.getTime() >= Date.now()) ?? false;

	return (
		<DoubleColorView heightViewPart={229} style={styles.background}>
			<View style={{ alignItems: "center" }}>
				{isActiveSubs && (
					<Text style={styles.isHaveSubscribe}>{Tools.i18n.t("a14d438c-e101-4e6b-9757-74d7f388c97b")}</Text>
				)}
				<AntDesign name="star" size={24} color={"#FBBC05"} />
				<Text style={styles.TitlePremium}>Premium</Text>
				<Text style={styles.currentMeditationInfo}>
					{info && info.nextPayment.getTime() >= Date.now()
						? Tools.i18n.t(
								info.autoPayment ? "392fd6e3-9b0c-4673-b1c2-45deeaadd7b1" : "048d71cd-03e2-4c8f-9f29-d2e5e9576a07",
								{
									datemtime: `${info.nextPayment.getDate()}.${
										info.nextPayment.getMonth() + 1
									}.${info.nextPayment.getFullYear()}`,
								}
						  )
						: Tools.i18n.t("636763b2-80fc-4bd3-84ac-63c21cd34d77")}
				</Text>
				<SubscribeCard
					image={require("./assets/pillow.png")}
					isSelected={selectedSubscribe === "1 month"}
					isUsed={isActiveSubs && info?.type === "1 month"}
					onPress={() => setSelectedSubscribe("1 month")}
					price={price.month_1}
					stylesContent={{
						textStyle: { color: "#702D87" },
						background: { backgroundColor: "#F3F3F3" },
					}}
					mainColor={"#702D87"}
					countMonth={1}
					textPrice={{
						top: Tools.i18n.t("1d05ec08-f140-4774-b71b-7e1ce078cd94", {
							price: price.month_1,
						}),
						bottom: Tools.i18n.t("4415fe5e-bd86-41b1-91ca-5b20c685172b"),
					}}
					onCancelSubscribe={() => {}}
					isShowCancelButton={info?.autoPayment ?? false}
				/>
				{isActiveSubs && info?.type === "1 month" && (
					<Text style={styles.offerToChangeSubscribeType}>{Tools.i18n.t("b6f80560-6ba6-4646-821a-a03ca72acb74")}</Text>
				)}
				<SubscribeCard
					image={require("./assets/armchair.png")}
					isSelected={selectedSubscribe === "6 month"}
					isUsed={isActiveSubs && info?.type === "6 month"}
					onPress={() => setSelectedSubscribe("6 month")}
					price={price.month_6}
					stylesContent={{
						textStyle: { color: "#FFFFFF" },
						background: { backgroundColor: "#702D87" },
					}}
					mainColor={"#FFFFFF"}
					countMonth={6}
					secondElement={
						<Text style={styles.benefitPrice}>
							{Tools.i18n.t("5b805945-9f3f-41df-a6c5-3d7d9747a118", {
								percent: Math.ceil(100 - (price.month_6 / (price.month_1 * 6)) * 100),
							})}
						</Text>
					}
					textPrice={{
						top: Tools.i18n.t("56b57ad2-f5f3-4f05-9f43-55d2edb25bdf", {
							price: price.month_6,
						}),
						bottom: Tools.i18n.t("84fe380b-74a9-4d02-9463-550c2d746617"),
					}}
					onCancelSubscribe={() => {}}
					// TODO: Navigation
					isShowCancelButton={info?.autoPayment ?? false}
				/>
			</View>
			<ColorButton
				styleButton={styles.button}
				styleText={styles.buttonText}
				animationStyle={aStyle.button}
				onPress={() => {
					modalRef.current?.open();
				}}
			>
				{Tools.i18n.t("Arrange")}
			</ColorButton>
			<CustomModal
				ref={modalRef}
				style={styles.informationMessage}
				mainStyle={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				}}
			>
				<Text style={styles.titleInformation}>
					{Tools.i18n.t(
						selectedSubscribe ? "2a881f76-a942-4175-a734-462661892693" : "0f3b106b-5bfb-4870-8405-3735cf6ac3a5"
					)}
				</Text>
				<Text style={styles.messageInformation}>
					{Tools.i18n.t(
						selectedSubscribe ? "664c1f21-3425-485a-b4d1-d59f8578207f" : "274347f0-628b-4128-8595-d6be9611ea03"
					)}
				</Text>
				<ColorButton styleButton={styles.buttonModal} styleText={styles.buttonModalText}>
					{Tools.i18n.t(selectedSubscribe ? "edit" : "off")}
				</ColorButton>
			</CustomModal>
		</DoubleColorView>
	);
};

export default SelectSubscribeScreen;

const styles = StyleSheet.create({
	TitlePremium: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("600"),
	},

	price: {
		...Tools.gStyle.font("600"),
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
		...Tools.gStyle.font("600"),
	},
	textPrice: {
		justifyContent: "space-between",
	},

	currentMeditationInfo: {
		color: "#E7DDEC",
		textAlign: "center",
		fontSize: 16,
		...Tools.gStyle.font("400"),
		width: "80%",
	},

	isHaveSubscribe: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("600"),
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
		...Tools.gStyle.font("600"),
		textAlign: "center",
	},

	benefitPrice: {
		color: "#FBBC05",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 27,
		paddingVertical: 7,
		borderRadius: 15,
		fontSize: 13,
		...Tools.gStyle.font("600"),
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
		...Tools.gStyle.font("400"),
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
