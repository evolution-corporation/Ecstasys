/** @format */

import React, { useCallback, useEffect } from "react";

import * as RN from "react-native";

import * as Dump from "~components/dump";

import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import i18n from "~i18n";
import gStyle, { fontStyle, viewStyle } from "~styles";

import { GeneralCompositeScreenProps, State, StatisticPeriod } from "~types";
import * as Store from "~store";
import { useFocusEffect } from "@react-navigation/native";
import { Converter, Request } from "~api";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserButton } from "~components/dump";

const getStartWeek = () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() - date.getDay());
	return date;
};

const Main: GeneralCompositeScreenProps = ({ navigation }) => {
	const [toDayPopularMeditation, setTodayPopularMeditation] = React.useState<State.Practice | null>(null);
	const { height } = RN.useWindowDimensions();
	const isNewUser = Store.useAppSelector(store => store.account.isNewUser)
	const [heightGreeting, setHeightGreeting] = React.useState<number | null>(null);
	//* Данные из глобального состояния
	const { displayName, image, nickName } = Store.useAppSelector(store => {
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

	useEffect(() => {
		Request.getPopularToDayMeditation().then(practice =>
			setTodayPopularMeditation(Converter.composePractice(practice))
		);
		if (isNewUser) {
			navigation.navigate('InputNameAndSelectGender')
		}
	}, []);

	return (
		<RN.ScrollView
			onScroll={({ nativeEvent }) => {
				if (!!heightGreeting) {
					let value = 20;
					let hiddenStatusBar = false;
					if (nativeEvent.contentOffset.y <= 20) {
						hiddenStatusBar = false;
						value = 20;
					} else if (nativeEvent.contentOffset.y < heightGreeting) {
						hiddenStatusBar = true;
						value = nativeEvent.contentOffset.y * 0.3 - 20;
					}
					// setStatusBarHidden(hiddenStatusBar, "slide");
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
			<StatusBar style="light" hidden={false} translucent backgroundColor={undefined} />
			<Animated.View
				style={greetingStyle}
				onLayout={({ nativeEvent: { layout } }) => {
					setHeightGreeting(layout.height);
				}}
			>
				<RN.ImageBackground
					source={require("/assets/backgroundMain.png")}
					style={styles.imageGreeting}
					imageStyle={{ top: -40 }}
				>
					<UserButton onPress={() => navigation.navigate("Profile")} style={{ alignSelf: "flex-start", left: 20 }} />
					<Dump.MessageProfessor
						greeting={greetingText}
						message={i18n.t(messageProfessor)}
						style={{ marginBottom: 41 }}
					/>
				</RN.ImageBackground>
			</Animated.View>
			<Animated.View
				style={[
					viewStyle.white,
					viewStyle.temple.feed,
					feedStyle,
					{ minHeight: height, paddingBottom: 75, padding: 20 },
				]}
			>
				<RN.Text style={styles.nameSection}>{i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}</RN.Text>
				<RN.Text style={styles.descriptionSection}>{i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}</RN.Text>
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
							dispatch(Store.actions.setPractice(recommendationPractice));

							if (recommendationPractice.type === "RELAXATION") {
								navigation.navigate("SelectTimeForRelax", {
									selectedPractice: recommendationPractice,
								});
							} else {
								navigation.navigate("PlayerForPractice", {
									selectedPractice: recommendationPractice,
								});
							}
						}}
					/>
				)}

				<Dump.StatisticsMeditation style={viewStyle.margin.mediumV} count={countMeditation} time={timeMeditation} />
				<RN.Text style={styles.nameSection}>{i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf")}</RN.Text>
				<RN.Text style={styles.descriptionSection}>{i18n.t("b47177ce-a266-4e2f-ba88-218f93de38a3")}</RN.Text>
				{toDayPopularMeditation !== null ? (
					<Dump.PracticeCard
						id={toDayPopularMeditation.id}
						style={{ marginTop: 13 }}
						description={toDayPopularMeditation.description}
						image={toDayPopularMeditation.image}
						lengthAudio={toDayPopularMeditation.length}
						name={toDayPopularMeditation.name}
						typePractice={toDayPopularMeditation.type}
						isPermission={toDayPopularMeditation.isNeedSubscribe && isSubscribe}
						onPress={() => {
							dispatch(Store.actions.setPractice(toDayPopularMeditation));

							if (toDayPopularMeditation.type === "RELAXATION") {
								navigation.navigate("SelectTimeForRelax", {
									selectedPractice: toDayPopularMeditation,
								});
							} else {
								navigation.navigate("PlayerForPractice", {
									selectedPractice: toDayPopularMeditation,
								});
							}
						}}
					/>
				) : null}
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
		paddingTop: 50,
	},
	professor: {
		width: 147,
		height: 147,
		alignSelf: "center",
	},
	userButton: {
		marginLeft: 20,
		marginTop: 40,
		alignSelf: "flex-start",
	},
	nameSection: {
		fontSize: 20,
		color: "#555555",
		...gStyle.font("400"),
	},
	descriptionSection: {
		fontSize: 14,
		...gStyle.font("400"),
		color: "#A0A0A0",
	},
});

export default Main;
