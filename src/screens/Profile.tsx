/** @format */

import React from "react";
import RN, { Text, ScrollView, StyleSheet, View, Pressable } from "react-native";
import Heart from "assets/icons/Interface/Vector.svg";
import Start from "assets/icons/Star.svg";
import { DoubleColorView } from "~components/containers";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import i18n from "~i18n";
import gStyle from "~styles";
import { actions, useAppDispatch, useAppSelector } from "~store";
import * as Dump from "src/components/dump";
import { StatisticPeriod, GeneralCompositeScreenProps, State } from "~types";
import { StatusBar } from "expo-status-bar";
import TreeLine from "~assets/ThreeLine.svg";
import { useDimensions } from "@react-native-community/hooks";
import useStaticPractice, { TimePeriod } from "src/hooks/use-statistics-practice";

const getStartWeek = () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() - date.getDay());
	return date;
};

const getStartMonth = () => {
	const date = new Date();
	date.setHours(23, 59, 59, 999);
	date.setDate(0);
	return date;
};

const Profile: GeneralCompositeScreenProps = ({ navigation }) => {
	//* local state
	const tabBarHeight = useBottomTabBarHeight();
	const [statisticPeriod, setStatisticPeriod] = React.useState<TimePeriod>(TimePeriod.month);
	const [heightScreen, setHeightScreen] = React.useState<number | null>(null);
	//* global state
	const { displayName, image, nickName } = useAppSelector(store => {
		if (store.account.currentData === undefined) throw new Error("Not found user");
		return store.account.currentData;
	});
	const { length: statisticCount, timeLength: statisticTime } = useStaticPractice(statisticPeriod);

	const subscribe = useAppSelector(store => {
		if (store.account.subscribe === undefined) return null;
		const endSubscribe = new Date(store.account.subscribe.whenSubscribe);
		endSubscribe.setDate(
			endSubscribe.getDate() +
				(store.account.subscribe.type === "WEEK" ? 7 : store.account.subscribe.type === "MONTH" ? 30 : 180)
		);
		if (endSubscribe.getTime() >= Date.now())
			return {
				endSubscribe: new Date(endSubscribe),
				autoPayment: store.account.subscribe.autoPayment,
			};
		return null;
	});

	const historyMeditation = useAppSelector(store => {
		const listUnique: State.Practice[] = [];
		for (const { practice } of store.practice.listPracticesListened) {
			if (listUnique.findIndex(({ id }) => practice.id === id) === -1) {
				listUnique.push(practice);
			}
		}
		return listUnique;
	});
	const appDispatch = useAppDispatch();
	const { window } = useDimensions();

	return (
		<DoubleColorView
			style={styles.background}
			heightViewPart={300}
			onLayout={({ nativeEvent: { layout } }) => {
				setHeightScreen(layout.height);
			}}
			scroll
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
					<Text style={{ ...gStyle.styles.header, color: "#FFFFFF", width: "auto" }}>{nickName}</Text>
					<Pressable
						style={{
							width: "18%",
							height: "100%",
							justifyContent: "center",
							alignItems: "flex-end",
						}}
						onPress={() => {
							navigation.navigate("Options");
						}}
					>
						<View style={{ flex: 1 }}>
							<TreeLine />
						</View>
					</Pressable>
				</View>
			}
		>
			<Dump.ProfileInformation
				image={image}
				displayName={displayName}
				subscribeInformation={
					subscribe === null
						? undefined
						: { endSubscribe: subscribe.endSubscribe, isAutoPayment: subscribe.autoPayment }
				}
				onPress={() => {
					navigation.navigate("EditUser");
				}}
				onChangeImage={image => {
					appDispatch(actions.updateAccount({ image }));
				}}
			/>
			<Dump.SelectTimePeriodStatistic
				onChangePeriod={time => {
					switch (time) {
						case StatisticPeriod.ALL: {
							setStatisticPeriod(TimePeriod.all);
						}
						case StatisticPeriod.MONTH: {
							setStatisticPeriod(TimePeriod.month);
						}
						case StatisticPeriod.WEEK: {
							setStatisticPeriod(TimePeriod.week);
						}
					}
				}}
				style={{ marginTop: 16 }}
			/>
			<Dump.StatisticsMeditation count={statisticCount} time={statisticTime} style={{ marginTop: 9 }} />
			<Dump.ColorWithIconButton
				icon={<Heart style={{ marginLeft: 20 }} />}
				styleButton={[styles.button, { marginTop: 18 }]}
				styleText={styles.buttonText}
				onPress={() => {
					navigation.navigate("FavoriteMeditation");
				}}
			>
				{i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1")}
			</Dump.ColorWithIconButton>
			<Dump.ColorWithIconButton
				icon={<Start style={{ marginLeft: 20 }} />}
				styleButton={styles.button}
				styleText={styles.buttonText}
				onPress={() => {
					navigation.navigate("SelectSubscribe");
				}}
			>
				{i18n.t("b2f016a6-b60e-4b5f-9cd9-ead2bddaa9d5")}
			</Dump.ColorWithIconButton>
			{historyMeditation.length > 0 ? (
				<>
					<RN.Text style={styles.historyText}>{i18n.t("7923b738-2122-408b-af79-caf0b1643cdf")}</RN.Text>
					<Dump.ShowListPractices
						historyPractices={historyMeditation}
						onPress={practice => {
							appDispatch(actions.setPractice(practice));
							if (practice.type === "RELAXATION") {
								navigation.navigate("SelectTimeForRelax", { selectedPractice: practice });
							} else {
								navigation.navigate("PlayerForPractice", {
									selectedPractice: practice,
								});
							}
						}}
						style={{ left: -20, right: -20, width: window.width }}
						contentContainerStyle={{ padding: 20 }}
					/>
				</>
			) : null}
		</DoubleColorView>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#7C3D91",
		borderRadius: 10,
		paddingHorizontal: 20,
		justifyContent: "flex-start",
		paddingLeft: 60,
		marginVertical: 7.5,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 14,
		...gStyle.font("500"),
	},
	background: { flex: 1, paddingHorizontal: 20 },
	historyText: {
		marginTop: 16,
		color: "#3D3D3D",
		fontSize: 20,
		...gStyle.font("600"),
	},
});

export default Profile;
