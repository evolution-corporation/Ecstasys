/** @format */

import React from "react";
import RN, { Dimensions, ScrollView, StyleSheet } from "react-native";
import Heart from "assets/icons/Heart_Red.svg";
import Start from "assets/icons/Star.svg";
import { DoubleColorView } from "~components/containers";
import Tools from "~core";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import i18n from "~i18n";

import { useAppSelector } from "~store";
import * as Models from "src/models";
import * as Dump from "src/components/dump";
import { StatisticPeriod, GeneralCompositeScreenProps } from "~types";
import core from "~core";

const Profile: GeneralCompositeScreenProps = ({ navigation }) => {
	//* local state
	const tabBarHeight = useBottomTabBarHeight();
	const [statisticPeriod, setStatisticPeriod] = React.useState<StatisticPeriod>(StatisticPeriod.MONTH);
	const [heightScreen, setHeightScreen] = React.useState<number | null>(null);
	//* global state
	const { displayName, image, nickName } = useAppSelector(store =>
		Models.Account.createByState(store.account).getUserData()
	);
	const [statisticCount, statisticTime] = useAppSelector(store =>
		Models.Statistic.createByState(store.statistic.data).getStatistic(statisticPeriod)
	);
	const subscribe = useAppSelector(store => Models.Account.createByState(store.account).subscribe);

	const historyMeditation = useAppSelector(store => Models.Statistic.createByState(store.statistic.data).getHistory());

	React.useEffect(() => {
		navigation.setOptions({
			title: nickName,
		});
	});
	return (
		<DoubleColorView
			style={styles.background}
			heightViewPart={300}
			onLayout={({ nativeEvent: { layout } }) => {
				setHeightScreen(layout.height);
			}}
		>
			<ScrollView>
				<Dump.ProfileInformation
					image={image}
					displayName={displayName}
					subscribeInformation={
						subscribe === null
							? undefined
							: { endSubscribe: subscribe.endSubscribe, isAutoPayment: subscribe.autoPayment }
					}
					onPress={() => {
						navigation.navigate("EditMainUserData");
					}}
				/>
				<Dump.SelectTimePeriodStatistic onChangePeriod={setStatisticPeriod} style={{ marginTop: 16 }} />
				<Dump.StatisticsMeditation count={statisticCount} time={statisticTime} style={{ marginTop: 9 }} />
				<Dump.ColorWithIconButton
					icon={<Heart />}
					styleButton={[styles.button, { marginTop: 18 }]}
					styleText={styles.buttonText}
					onPress={() => {
						navigation.navigate("FavoriteMeditation");
					}}
				>
					{i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1")}
				</Dump.ColorWithIconButton>
				<Dump.ColorWithIconButton
					icon={<Start />}
					styleButton={styles.button}
					styleText={styles.buttonText}
					onPress={() => {
						navigation.navigate("SelectSubscribe");
					}}
				>
					{i18n.t("b2f016a6-b60e-4b5f-9cd9-ead2bddaa9d5")}
				</Dump.ColorWithIconButton>
				{heightScreen !== null && heightScreen - tabBarHeight > 550 && (
					<>
						<RN.Text style={styles.historyText}>{i18n.t("7923b738-2122-408b-af79-caf0b1643cdf")}</RN.Text>
						<Dump.ShowListPractices historyPractices={historyMeditation} />
					</>
				)}
			</ScrollView>
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
		...Tools.gStyle.font("500"),
	},
	background: { flex: 1, paddingHorizontal: 20 },
	historyText: {
		marginTop: 16,
		color: "#3D3D3D",
		fontSize: 20,
		...core.gStyle.font("600"),
	},
});

export default Profile;
