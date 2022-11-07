/** @format */

import React, { ElementRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { CustomModal, DoubleColorView } from "~components/containers";
import { ColorButton } from "~components/dump";
import i18n from "~i18n";
import gStyle from "~styles";

import { RootScreenProps, SubscribeType } from "~types";
import { SubscribeCard } from "./components";
import store, { actions, useAppDispatch, useAppSelector } from "~store";

const price = {
	month_1: 279,
	month_6: 1179,
};

const SelectSubscribeScreen: RootScreenProps<"SelectSubscribe"> = () => {
	const subscribe = useAppSelector(store => store.account.subscribe);

	const [selectedSubscribeType, setSelectedSubscribeType] = useState<SubscribeType | null>(null);

	// const modalRef = useRef<ElementRef<typeof CustomModal>>(null);

	const _transporteeYButton = useSharedValue(300);
	const aStyle = {
		button: useAnimatedStyle(() => ({
			transform: [
				{
					translateY: withSpring(_transporteeYButton.value),
				},
			],
		})),
	};

	useEffect(() => {
		if (selectedSubscribeType !== undefined && subscribe !== undefined && selectedSubscribeType !== subscribe.type) {
			_transporteeYButton.value = 0;
		}
	}, [selectedSubscribeType]);
	const appDispatch = useAppDispatch();
	const isActiveSubs = (subscribe !== undefined && new Date(subscribe.whenSubscribe) >= new Date()) ?? false;

	const editSubscribe = () => {
		if (selectedSubscribeType !== null) appDispatch(actions.getPaymentURLForSubscribe(selectedSubscribeType));
	};

	return (
		<DoubleColorView heightViewPart={229} style={styles.background}>
			<View style={{ alignItems: "center" }}>
				{isActiveSubs && <Text style={styles.isHaveSubscribe}>{i18n.t("a14d438c-e101-4e6b-9757-74d7f388c97b")}</Text>}
				<AntDesign name="star" size={24} color={"#FBBC05"} />
				<Text style={styles.TitlePremium}>Premium</Text>
				<Text style={styles.currentMeditationInfo}>
					{subscribe && new Date(subscribe.whenSubscribe) >= new Date()
						? i18n.t(
								subscribe.autoPayment ? "392fd6e3-9b0c-4673-b1c2-45deeaadd7b1" : "048d71cd-03e2-4c8f-9f29-d2e5e9576a07",
								{
									datemtime: i18n.strftime(new Date(subscribe.whenSubscribe), "%d%m%Y"),
								}
						  )
						: i18n.t("636763b2-80fc-4bd3-84ac-63c21cd34d77")}
				</Text>
				<SubscribeCard
					image={require("./assets/pillow.png")}
					isSelected={selectedSubscribeType === SubscribeType.MONTH}
					isUsed={isActiveSubs && subscribe?.type === "MONTH"}
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
					isShowCancelButton={subscribe?.autoPayment ?? false}
				/>
				{isActiveSubs && subscribe?.type === "MONTH" && (
					<Text style={styles.offerToChangeSubscribeType}>{i18n.t("b6f80560-6ba6-4646-821a-a03ca72acb74")}</Text>
				)}
				<SubscribeCard
					image={require("./assets/armchair.png")}
					isSelected={selectedSubscribeType === SubscribeType.HALF_YEAR}
					isUsed={isActiveSubs && subscribe?.type === "HALF_YEAR"}
					onPress={() => setSelectedSubscribeType(SubscribeType.HALF_YEAR)}
					price={price.month_6}
					stylesContent={{
						textStyle: { color: "#FFFFFF" },
						background: { backgroundColor: "#702D87" },
					}}
					mainColor={"#FFFFFF"}
					countMonth={6}
					secondElement={
						<Text style={styles.benefitPrice}>
							{i18n.t("5b805945-9f3f-41df-a6c5-3d7d9747a118", {
								percent: Math.ceil(100 - (price.month_6 / (price.month_1 * 6)) * 100),
							})}
						</Text>
					}
					textPrice={{
						top: i18n.t("56b57ad2-f5f3-4f05-9f43-55d2edb25bdf", {
							price: price.month_6,
						}),
						bottom: i18n.t("84fe380b-74a9-4d02-9463-550c2d746617"),
					}}
					onCancelSubscribe={() => {}}
					// TODO: Navigation
					isShowCancelButton={subscribe?.autoPayment ?? false}
				/>
			</View>
			<ColorButton
				styleButton={styles.button}
				styleText={styles.buttonText}
				animationStyle={aStyle.button}
				onPress={() => {
					editSubscribe();
				}}
			>
				{i18n.t("Arrange")}
			</ColorButton>
			{/* <CustomModal
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
					{i18n.t(
						selectedSubscribeType !== null
							? "2a881f76-a942-4175-a734-462661892693"
							: "0f3b106b-5bfb-4870-8405-3735cf6ac3a5"
					)}
				</Text>
				<Text style={styles.messageInformation}>
					{i18n.t(
						selectedSubscribeType !== null
							? "664c1f21-3425-485a-b4d1-d59f8578207f"
							: "274347f0-628b-4128-8595-d6be9611ea03"
					)}
				</Text>
				<ColorButton styleButton={styles.buttonModal} styleText={styles.buttonModalText}>
					{i18n.t(selectedSubscribeType !== null ? "edit" : "off")}
				</ColorButton>
			</CustomModal> */}
		</DoubleColorView>
	);
};

export default SelectSubscribeScreen;

const styles = StyleSheet.create({
	TitlePremium: {
		color: "#FFFFFF",
		fontSize: 20,
		...gStyle.font("600"),
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
