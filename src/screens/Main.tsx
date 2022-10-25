/** @format */

import React, { useCallback } from "react";

import * as RN from "react-native";

import * as Dump from "~components/dump";
import Tools from "~core";

import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import i18n from "~i18n";
import { fontStyle, viewStyle } from "~styles";

import { GeneralCompositeScreenProps, State, StatisticPeriod } from "~types";
import * as Store from "~store";
import { useFocusEffect } from "@react-navigation/native";
import { Converter, Request } from "~api";
import practice from "src/store/reducers/practice";

const getStartWeek = () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() - date.getDay());
	return date;
};

const Main: GeneralCompositeScreenProps = ({ navigation }) => {
	const [toDayPopularMeditation, setTodayPopularMeditation] = React.useState<State.Practice | null>(null);
	const { height } = RN.useWindowDimensions();
	const [heightGreeting, setHeightGreeting] = React.useState<number | null>(null);
	//* Данные из глобального состояния
	const { displayName } = Store.useAppSelector(store => {
		if (store.account.currentData === undefined) throw new Error("Not Found User Data");
		return store.account.currentData;
	});
	const [countMeditation, timeMeditation] = Store.useAppSelector(store => {
		const listPracticesListenedWeek = store.practice.listPracticesListened.filter(
			item => new Date(item.dateListen) >= getStartWeek()
		);
		return [
			listPracticesListenedWeek.length,
			listPracticesListenedWeek.reduce((value, item) => value + item.msListened, 0),
		];
	});
	const [messageProfessor, greeting] = Store.useAppSelector(store => {
		if (store.style.messageProfessor === undefined) throw new Error("not found Message By Professor");
		const lastUpdate = new Date(store.style.messageProfessor.dateTimeLastUpdate);
		const hours = lastUpdate.getHours();
		let greetingDay: string | null;
		if (hours >= 0 && hours < 6) {
			greetingDay = "06c305e9-2d05-4465-a0bf-8baa0de88baf";
		} else if (hours >= 6 && hours < 12) {
			greetingDay = "a6c20644-393e-410d-9d76-b5859128a20e";
		} else if (hours >= 12 && hours < 18) {
			greetingDay = "469021f2-3e5c-4cee-b33a-ffd1bb12a7ef";
		} else {
			greetingDay = "52a1a44e-d621-4d55-b0df-b21ddea89872";
		}
		if (Date.now() - lastUpdate.getTime() > 300000) {
			greetingDay = null;
		}
		return [store.style.messageProfessor.idMessage, greetingDay];
	});
	const recommendationPractice = Store.useAppSelector(store => store.practice.recommendationPracticeToDay ?? null);
	const isSubscribe = Store.useAppSelector(store => {
		if (store.account.subscribe === undefined) return false;
		const endSubscribe = new Date(store.account.subscribe.whenSubscribe);
		endSubscribe.setDate(
			endSubscribe.getDate() +
				(store.account.subscribe.type === "WEEK" ? 7 : store.account.subscribe.type === "MONTH" ? 30 : 90)
		);
		return endSubscribe.getTime() >= Date.now();
	});
	const dispatch = Store.useAppDispatch();
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

	useFocusEffect(
		useCallback(() => {
			Request.getPopularToDayMeditation().then(practice =>
				setTodayPopularMeditation(Converter.composePractice(practice))
			);
		}, [])
	);

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
					console.info(heightGreeting, layout.height);
					setHeightGreeting(layout.height);
				}}
			>
				<RN.ImageBackground source={require("/assets/backgroundMain.png")} style={styles.imageGreeting}>
					<Dump.UserButton style={styles.userButton} />
					<Dump.MessageProfessor
						greeting={greetingText}
						message={i18n.t(messageProfessor)}
						style={{ marginBottom: 41 }}
					/>
				</RN.ImageBackground>
			</Animated.View>
			<Animated.View style={[viewStyle.white, viewStyle.temple.feed, feedStyle, { minHeight: height }]}>
				<RN.Text style={[fontStyle.title.h3_Roboto, fontStyle.darkLetters]}>
					{i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}
				</RN.Text>
				<RN.Text style={[fontStyle.description.regular, fontStyle.noName1]}>
					{i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}
				</RN.Text>
				{recommendationPractice === null ? null : (
					<Dump.PracticeCard
						id={recommendationPractice.id}
						style={{ marginTop: 13 }}
						description={recommendationPractice.description}
						image={recommendationPractice.image}
						lengthAudio={recommendationPractice.length}
						name={recommendationPractice.name}
						typePractice={recommendationPractice.type}
						isPermission={recommendationPractice.isNeedSubscribe && isSubscribe}
						onPress={() => {
							if (recommendationPractice.type === "RELAXATION") {
								navigation.navigate("SelectTimeForRelax", {
									selectedPractice: recommendationPractice,
								});
							} else {
								dispatch(Store.actions.setPractice(recommendationPractice));
								navigation.navigate("PlayerForPractice", {
									practiceLength: recommendationPractice.length,
									selectedPractice: recommendationPractice,
								});
							}
						}}
					/>
					// <MeditationCard
					// 	name={recommendationMeditation.name}
					// 	description={recommendationMeditation.description}
					// 	time={recommendationMeditation.lengthAudio}
					// 	id={recommendationMeditation.id}
					// />
					// <RN.ActivityIndicator color={"#9765A8"} size={"large"} />
				)}

				<Dump.StatisticsMeditation style={viewStyle.margin.mediumV} count={countMeditation} time={timeMeditation} />
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

	title: { ...fontStyle.title.h3_Roboto, ...fontStyle.darkLetters },
	description: { ...fontStyle.description.regular, ...fontStyle.noName1 },
});

export default Main;
