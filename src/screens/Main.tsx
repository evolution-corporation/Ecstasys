/** @format */

import React from "react";

import * as RN from "react-native";

import { UserButton } from "~components/dump";
import Tools from "~core";

import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useBackHandler } from "@react-native-community/hooks";
import i18n from "~i18n";

import { GeneralCompositeScreenProps, Meditation, StatisticPeriod } from "~types";
import * as Store from "~store";
import * as Models from "src/models";
import * as Dump from "src/components/dump";
import i18n from "~i18n";

const Main: GeneralCompositeScreenProps = ({ navigation }) => {
	const [recommendationMeditation, setRecommendationMeditation] = React.useState<Meditation | null>(null);
	const [toDayPopularMeditation, setTodayPopularMeditation] = React.useState<Meditation | null>(null);

	const [heightGreeting, setHeightGreeting] = React.useState<number | null>(null);
	//* Данные из глобального состояния
	const { displayName } = Store.useAppSelector(store => Models.Account.createByState(store.account).getUserData());
	const [countMeditation, timeMeditation] = Store.useAppSelector(store =>
		Models.Statistic.createByState(store.statistic.data).getStatistic(StatisticPeriod.WEEK)
	);
	const [messageProfessor, greeting] = Store.useAppSelector(store =>
		Models.MessageProfessor.createByState(store.style.messageProfessor).getMessage()
	);
	//* -----------
	const translateGreeting = useSharedValue(0);
	const greetingStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateGreeting.value }],
	}));

	const feedStyle = useAnimatedStyle(() => ({
		borderTopLeftRadius: interpolate(translateGreeting.value, [20, 100], [20, 0]),
		borderTopRightRadius: interpolate(translateGreeting.value, [20, 100], [20, 0]),
	}));

	const greetingText = React.useMemo(() => {
		let _greetingText: string | undefined;
		if (greeting !== null) _greetingText = i18n.t(greeting);
		if (_greetingText === undefined && displayName !== undefined) return displayName + "!";
		if (_greetingText !== undefined && displayName === undefined) return _greetingText + "!";
		if (_greetingText !== undefined && displayName !== undefined) return `${_greetingText}, ${displayName}!`;
		return undefined;
	}, [displayName, greeting]);

	return (
		<RN.ScrollView
			onScroll={({ nativeEvent }) => {
				if (!!heightGreeting) {
					let value = 20;
					if (nativeEvent.contentOffset.y <= 20) {
						value = 20;
					} else if (nativeEvent.contentOffset.y < heightGreeting) {
						value = nativeEvent.contentOffset.y * 0.3;
					} else {
						value = heightGreeting;
					}

					translateGreeting.value = value;
				}
			}}
			style={{
				position: "absolute",
				height: RN.Dimensions.get("window").height + 100,
				width: "100%",
				top: -70,
				bottom: -50,
			}}
			showsVerticalScrollIndicator={false}
			stickyHeaderHiddenOnScroll
			contentContainerStyle={{ paddingVertical: 50 }}
			bounces={false}
		>
			<Animated.View
				style={greetingStyle}
				onLayout={({ nativeEvent: { layout } }) => {
					if (!!heightGreeting) setHeightGreeting(layout.height);
				}}
			>
				<RN.ImageBackground source={require("/assets/backgroundMain.png")} style={styles.imageGreeting}>
					<UserButton style={styles.userButton} />
					<Dump.MessageProfessor greeting={greetingText} message={i18n.t(messageProfessor)} />
				</RN.ImageBackground>
			</Animated.View>
			<Animated.View style={[styles.feed, feedStyle]}>
				<RN.Text style={styles.title}>{i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}</RN.Text>
				<RN.Text style={styles.description}>{i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}</RN.Text>
				{recommendationMeditation !== null ? null : (
					// <MeditationCard
					// 	name={recommendationMeditation.name}
					// 	description={recommendationMeditation.description}
					// 	time={recommendationMeditation.lengthAudio}
					// 	id={recommendationMeditation.id}
					// />
					<RN.ActivityIndicator color={"#9765A8"} size={"large"} />
				)}

				<Dump.StatisticsMeditation style={styles.statisticsMeditation} count={countMeditation} time={timeMeditation} />
				<RN.Text style={styles.title}>{i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}</RN.Text>
				<RN.Text style={styles.description}>{i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}</RN.Text>
				{toDayPopularMeditation !== null ? null : ( // /> // 	id={toDayPopularMeditation.id} // 	time={toDayPopularMeditation.lengthAudio} // 	description={toDayPopularMeditation.description} // 	name={toDayPopularMeditation.name} // <MeditationCard
					<RN.ActivityIndicator color={"#9765A8"} size={"large"} />
				)}
			</Animated.View>
		</RN.ScrollView>
	);
};

const styles = RN.StyleSheet.create({
	image: {
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	imageGreeting: {
		justifyContent: "flex-start",
		width: "100%",
		paddingBottom: 20,
	},
	professor: {
		width: 147,
		height: 147,
		alignSelf: "center",
	},
	userButton: {
		marginLeft: 20,
		marginTop: 20,
		alignSelf: "flex-start",
	},
	greetingViewBackground: {
		paddingTop: 5,
		justifyContent: "flex-start",
		width: "100%",
		marginBottom: 40,
	},
	title: {
		color: "#555555",
		fontSize: RN.Dimensions.get("window").height * 0.026,
		lineHeight: 23,
		...Tools.gStyle.font("400"),
		marginBottom: 7,
	},
	description: {
		color: "#A0A0A0",
		fontSize: RN.Dimensions.get("window").height * 0.018,
		lineHeight: 16,
		...Tools.gStyle.font("400"),
		marginBottom: 12,
	},
	statisticsMeditation: {
		marginVertical: 22,
	},
	userProfile: {
		alignSelf: "flex-start",
		marginLeft: 20,
	},
	feed: {
		backgroundColor: "#FFFFFF",
		minHeight: RN.Dimensions.get("window").height,
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	greeting: {
		fontSize: RN.Dimensions.get("window").height * 0.035,
		color: "#FFFFFF",
		textAlign: "center",
		...Tools.gStyle.font("700"),
	},
	greetingView: {
		alignSelf: "center",
		alignItems: "center",
	},
	lineBR: {
		width: "20%",
		height: 1,
		backgroundColor: "#FFFFFF",
		marginHorizontal: 5,
	},
	catchPhrases: {
		fontSize: RN.Dimensions.get("screen").height * 0.018,
		textAlign: "center",
		color: "#FFFFFF",
		lineHeight: 20,
		maxWidth: "68%",
		...Tools.gStyle.font("400"),
	},
});

export default Main;
