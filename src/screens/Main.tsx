/** @format */

import React, { useEffect } from "react";

import * as RN from "react-native";

import * as Dump from "src/components/dump";

import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import i18n from "~i18n";
import gStyle, { viewStyle } from "~styles";

import { GeneralCompositeScreenProps } from "~types";
import * as Store from "~store";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import useUserInformation from "src/hooks/use-user-information";
import usePopularPractice from "src/hooks/use-popular-practice";
import useRecommendationPractice from "src/hooks/use-recomendation-practice";
import useStaticPractice, { TimePeriod } from "src/hooks/use-statistics-practice";
import useIsNewUser from "src/hooks/use-is-new-user";
import ViewFullSpace from "~components/layouts/view-full-space";
import ViewFullWidth, { Direction } from "~components/layouts/view-full-width";
import TitleAndSubTitle from "~components/Text/title-and-sub-title";
import ViewPaddingList, { Direction as DirectionForPaddingList } from "~components/containers/view-padding-list";
import Star from "assets/icons/Star.svg";

const styles = RN.StyleSheet.create({
	image: {
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	imageGreeting: {
		justifyContent: "flex-start",
		width: "100%",
		paddingBottom: 20,
		paddingTop: 70,
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
		marginBottom: 3,
	},
	descriptionSection: {
		fontSize: 14,
		...gStyle.font("400"),
		color: "#A0A0A0",
	},
});

const Main: GeneralCompositeScreenProps = ({ navigation }) => {
	const [toDayPopularMeditation, , isLoadingPopularPractice] = usePopularPractice();
	const isNewUser = useIsNewUser();
	const [heightGreeting, setHeightGreeting] = React.useState<number>();
	//* Данные из глобального состояния
	const { displayName } = useUserInformation();

	const { length: countMeditation, timeLength: timeMeditation } = useStaticPractice(TimePeriod.week);

	const [messageProfessor, greeting] = Store.useAppSelector(store => {
		if (store.style.messageProfessor === undefined) throw new Error("not found Message By Professor");
		const lastUpdate = new Date(store.style.messageProfessor.dateTimeLastUpdate);
		const hours = lastUpdate.getHours();
		let greetingDay: string | undefined;
		if (hours >= 0 && hours < 6) {
			greetingDay = i18n.t("06c305e9-2d05-4465-a0bf-8baa0de88baf");
		} else if (hours >= 6 && hours < 12) {
			greetingDay = i18n.t("a6c20644-393e-410d-9d76-b5859128a20e");
		} else if (hours >= 12 && hours < 18) {
			greetingDay = i18n.t("469021f2-3e5c-4cee-b33a-ffd1bb12a7ef");
		} else {
			greetingDay = i18n.t("52a1a44e-d621-4d55-b0df-b21ddea89872");
		}
		if (Date.now() - lastUpdate.getTime() > 300_000) {
			greetingDay = undefined;
		}
		return [store.style.messageProfessor.idMessage, greetingDay];
	});
	const recommendationPractice = useRecommendationPractice();
	const isSubscribe = useIsActivateSubscribe();

	//* -----------
	const translateGreeting = useSharedValue(0);
	const greetingStyle = useAnimatedStyle(() => ({
		// transform: [{ translateY: translateGreeting.value }],
	}));

	const greetingText = React.useMemo(() => {
		let _greetingText: string | undefined;
		if (greeting !== null) _greetingText = greeting;
		if (_greetingText === undefined && displayName !== undefined) return displayName + "!";
		if (_greetingText !== undefined && displayName === undefined) return _greetingText + "!";
		if (_greetingText !== undefined && displayName !== undefined) return `${_greetingText}, ${displayName}!`;
		return undefined;
	}, [displayName, greeting]);

	useEffect(() => {
		if (isNewUser) {
			navigation.navigate("InputNameAndSelectGender");
		}
	}, []);

	const RecommendationPracticeBlock = !!recommendationPractice ? (
		<>
			<TitleAndSubTitle
				title={i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}
				subtitle={i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}
				styleTitle={styles.nameSection}
				styleSubTitle={styles.descriptionSection}
			/>
			<Dump.PracticeCard
				id={recommendationPractice.id}
				style={{ marginTop: 12 }}
				description={recommendationPractice.description}
				image={recommendationPractice.image}
				lengthAudio={recommendationPractice.length}
				name={recommendationPractice.name}
				typePractice={recommendationPractice.type}
				isPermission={recommendationPractice.isNeedSubscribe ? isSubscribe : true}
				onPress={() => {
					if (recommendationPractice.isNeedSubscribe ? isSubscribe : true) {
						if (recommendationPractice.type === "RELAXATION") {
							navigation.navigate("SelectTimeForRelax", {
								selectedPractice: recommendationPractice,
							});
						} else {
							navigation.navigate("PlayerForPractice", {
								selectedPractice: recommendationPractice,
							});
						}
					} else {
						navigation.navigate("ByMaySubscribe");
					}
				}}
			/>
		</>
	) : (
		<></>
	);

	const PopularPracticeBlock =
		!!toDayPopularMeditation || (!toDayPopularMeditation && isLoadingPopularPractice) ? (
			<RN.Pressable
				style={{
					backgroundColor: "#FFF",
					borderRadius: 20,
					...gStyle.shadows(1, 4),
					shadowColor: RN.Platform.OS === "ios" ? "rgba(0,0,0,0.25)" : undefined,
					marginTop: 28,
				}}
				onPress={() => {
					if (toDayPopularMeditation) {
						if (toDayPopularMeditation.type === "RELAXATION") {
							navigation.navigate("SelectTimeForRelax", {
								selectedPractice: toDayPopularMeditation,
							});
						} else {
							navigation.navigate("PlayerForPractice", {
								selectedPractice: toDayPopularMeditation,
							});
						}
					}
				}}
			>
				<RN.View
					style={{
						width: 50,
						height: 50,
						borderRadius: 25,
						backgroundColor: "#9765A8",
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: -28,
						alignSelf: "center",
					}}
				>
					<Star />
				</RN.View>
				<ViewPaddingList paddings={[28, 15, 0]} direction={DirectionForPaddingList.Vertical}>
					<TitleAndSubTitle
						title={i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf")}
						subtitle={i18n.t("b47177ce-a266-4e2f-ba88-218f93de38a3")}
						styleTitle={[styles.nameSection, { alignSelf: "center" }]}
						styleSubTitle={[styles.descriptionSection, { alignSelf: "center", textAlign: "center" }]}
					/>

					{toDayPopularMeditation ? (
						<Dump.PracticeCard
							id={toDayPopularMeditation.id}
							description={toDayPopularMeditation.description}
							image={toDayPopularMeditation.image}
							lengthAudio={toDayPopularMeditation.length}
							name={toDayPopularMeditation.name}
							typePractice={toDayPopularMeditation.type}
							isPermission={toDayPopularMeditation.isNeedSubscribe && isSubscribe}
							onPress={() => {}}
						/>
					) : (
						<RN.ActivityIndicator />
					)}
				</ViewPaddingList>
			</RN.Pressable>
		) : (
			<></>
		);

	return (
		<RN.ScrollView
			onScroll={({ nativeEvent }) => {
				if (!!heightGreeting) {
					let value = 20;
					// let hiddenStatusBar = false;
					if (nativeEvent.contentOffset.y <= 20) {
						// hiddenStatusBar = false;
						value = 20;
					} else if (nativeEvent.contentOffset.y < heightGreeting) {
						// hiddenStatusBar = true;
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
			<Animated.View
				style={greetingStyle}
				onLayout={({ nativeEvent: { layout } }) => {
					setHeightGreeting(layout.height);
				}}
			>
				<RN.ImageBackground
					source={require("assets/mount-kilimanjaro-g2cd7e043a_19202.png")}
					style={styles.imageGreeting}
					imageStyle={{ top: -40 }}
				>
					<Dump.UserButton
						onPress={() => navigation.navigate("Profile")}
						style={{ alignSelf: "flex-start", left: 20, marginBottom: 20 }}
					/>
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
					{
						// minHeight: height,
						paddingBottom: 80,
						top: -20,
						paddingTop: 20,
					},
				]}
			>
				<ViewFullWidth direction={Direction.TopBottom} standardHorizontalPadding>
					{RecommendationPracticeBlock}
					<Dump.StatisticsMeditation style={viewStyle.margin.mediumV} count={countMeditation} time={timeMeditation} />
					{PopularPracticeBlock}
				</ViewFullWidth>
			</Animated.View>
		</RN.ScrollView>
	);
};

export default Main;
