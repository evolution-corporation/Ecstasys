/** @format */

import React, { FC, memo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";

import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Core from "~core";
import i18n from "~i18n";
import gStyle from "~styles";

import * as Screens from "src/screens";

import MainIconSelected from "assets/icons/HomeSelectedIcon.svg";
import PracticesIconSelected from "assets/icons/PracticeSelectedIcon.svg";
import ProfileIconSelected from "assets/icons/ProfileSelectedIcon.svg";
import DMDIconSelected from "assets/icons/DMDSelectedIcon.svg";
import MainIconNoSelected from "assets/icons/HomeNoSelectedIcon.svg";
import PracticesIconNoSelected from "assets/icons/PracticeNoSelectedIcon.svg";
import ProfileIconNoSelected from "assets/icons/ProfileNoSelectedIcon.svg";
import DMDIconNoSelected from "assets/icons/DMDNoSelectedIcon.svg";

import { RootScreenProps, RootStackList, State, TabNavigatorList } from "~types";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import ArrowBack from "assets/icons/ArrowBack.svg";
import useAccountStatus from "./hooks/use-account-status";
import IsFavorite from "~components/dump/IsFavorite";

const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => {
	const insets = useSafeAreaInsets();

	return (
		<TabNavigator.Navigator
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					minHeight: 75 + insets.bottom,
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
					// paddingBottom: insets.bottom,
				},
				tabBarItemStyle: {
					flex: 0,
					paddingHorizontal: 40,

					maxWidth: Dimensions.get("window").width / 4,
				},
				headerShown: false,
			}}
		>
			<TabNavigator.Screen
				name={"Main"}
				component={Screens.Main}
				options={{
					tabBarIcon: ({ focused }) => (focused ? <MainIconSelected /> : <MainIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"PracticesList"}
				component={Screens.PracticesList}
				options={{
					tabBarIcon: ({ focused }) => (focused ? <PracticesIconSelected /> : <PracticesIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"RelaxListForDMD"}
				component={Screens.RelaxListForDMD}
				options={{
					tabBarIcon: ({ focused }) => (focused ? <DMDIconSelected /> : <DMDIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"Profile"}
				component={Screens.Profile}
				options={{
					tabBarIcon: ({ focused }) => (focused ? <ProfileIconSelected /> : <ProfileIconNoSelected />),
				}}
			/>
		</TabNavigator.Navigator>
	);
};

const RootNavigation = createSharedElementStackNavigator<RootStackList>();
// const RootNavigation = createNativeStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
	const accountStatus = useAccountStatus();
	let screenList;
	switch (accountStatus) {
		case "NO_AUTHENTICATION": {
			screenList = (
				<>
					<RootNavigation.Screen
						name={"IntroAboutApp"}
						component={Screens.IntroAboutApp}
						options={{ headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"IntroAboutYou"}
						component={Screens.IntroAboutYou}
						options={{ headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"SelectMethodAuthentication"}
						component={Screens.SelectMethodAuthentication}
						options={{ headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"InputNumberPhone"}
						component={Screens.InputNumberPhone}
						options={{ title: i18n.t("c44c1286-2e08-4c18-ac68-4bae712c26a8") }}
					/>
					<RootNavigation.Screen name={"InputSMSCode"} component={Screens.InputSMSCode} options={{ title: "" }} />
				</>
			);
			break;
		}
		case "NO_REGISTRATION": {
			screenList = (
				<>
					<RootNavigation.Screen
						name={"InputNickname"}
						component={Screens.InputNickname}
						options={{ title: i18n.t("323361e3-4ef1-4935-b3b2-03494b482a77") }}
					/>
					<RootNavigation.Screen
						name={"InputImageAndBirthday"}
						component={Screens.InputImageAndBirthday}
						options={{
							title: i18n.t("01e5182d-f190-4bcb-9668-36a193e18325"),
						}}
					/>
					<RootNavigation.Screen
						name={"ConfirmationSignOut"}
						component={Screens.ConfirmationSignOut}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen name={"Greeting"} component={Screens.Greeting} options={{ headerShown: false }} />
				</>
			);
			break;
		}
		case "IS_LOADING": {
			return (
				<RootNavigation.Screen
					name={"Loading"}
					component={() => (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<ActivityIndicator />
						</View>
					)}
				/>
			);
		}
		default: {
			screenList = (
				<>
					<RootNavigation.Screen name={"TabNavigator"} component={TabRoutes} options={{ headerShown: false }} />
					<RootNavigation.Screen name={"Options"} component={Screens.Options} options={{ title: i18n.t("options") }} />
					<RootNavigation.Screen
						name={"FavoriteMeditation"}
						component={Screens.FavoriteMeditation}
						options={{ title: i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1") }}
					/>
					<RootNavigation.Screen
						name={"EditUser"}
						component={Screens.EditUser}
						options={{ title: i18n.t("Profile") }}
					/>
					<RootNavigation.Screen
						name={"EditUserBirthday"}
						component={Screens.EditUserBirthday}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"SelectSet"}
						component={Screens.SelectSet}
						options={{ title: i18n.t("DMD") }}
						// sharedElements={({ params }) => {
						// 	const { id } = params.selectedRelax as State.Practice;
						// 	return [`practice.item.${id}`];
						// }}
					/>
					<RootNavigation.Screen
						name={"DMDSettingNotification"}
						component={Screens.DMDSettingNotification}
						options={({ route: { params } }) => ({
							title: params.selectedRelax.name,
						})}
					/>
					<RootNavigation.Screen
						name={"DMDSelectTimeBright"}
						component={Screens.DMDSelectTimeBright}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen name={"PlayerForDMD"} component={Screens.PlayerForDMD} />
					<RootNavigation.Screen name={"PracticeListByType"} component={Screens.PracticeListByType} />
					<RootNavigation.Screen
						name={"SelectTimeForRelax"}
						component={Screens.SelectTimeForRelax}

						// sharedElements={({ params }) => {
						// 	const { id } = params.selectedPractice as State.Practice;
						// 	return [`practice.item.${id}`];
						// }}
					/>
					<RootNavigation.Screen
						name={"PlayerForRelaxation"}
						component={Screens.PlayerForRelaxation}
						// sharedElements={route => {
						// 	const { imageId } = route.params;
						// 	return [{ id: `item.${imageId}`, animation: "move" }];
						// }}
					/>
					<RootNavigation.Screen
						name={"SelectBackgroundSound"}
						component={Screens.SelectBackgroundSound}
						options={{
							title: i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90"),
						}}
					/>
					<RootNavigation.Screen
						name={"MessageLog"}
						component={Screens.MessageLog}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"IntroPractices"}
						component={Screens.IntroPractices}
						options={{ headerShown: false }}
					/>
					<RootNavigation.Screen name={"DMDIntro"} component={Screens.DMDIntro} options={{ headerShown: false }} />
					<RootNavigation.Screen
						name={"PlayerForPractice"}
						component={Screens.PlayerForPractice}
						options={({ route: { params } }) => ({
							title: params.selectedPractice.name,
							headerRight: params.selectSet === undefined ? () => <IsFavorite practice={params.selectedPractice} /> : undefined,
						})}
					/>
					<RootNavigation.Screen
						name={"SelectSubscribe"}
						component={Screens.SelectSubscribe}
						options={{ title: i18n.t("b7ea21ef-8f8b-4dbb-9845-74a32a475e6b") }}
					/>
					<RootNavigation.Screen
						name={"PlayerMeditationOnTheMandala"}
						component={Screens.PlayerMeditationOnTheMandala}
						options={{
							title: i18n.t("db679041-5c95-4487-a86a-7bbb38d7d220"),
						}}
						initialParams={{ isNeedVoice: false, practiceLength: 600000 }}
					/>
					<RootNavigation.Screen
						name={"PlayerMeditationOnTheNose"}
						component={Screens.PlayerMeditationOnTheNose}
						options={{
							title: i18n.t("6dff586b-050e-4476-9b9f-8fd5c1114afa"),
						}}
						initialParams={{ isNeedVoice: false, practiceLength: 600000 }}
					/>
					<RootNavigation.Screen
						name={"SelectTimeForBase"}
						component={Screens.SelectTimeForBase}
						// sharedElements={({ params }) => {
						// 	const { id } = params.selectedPractice as State.Practice;
						// 	return [`practice.item.${id}`];
						// }}
					/>
					<RootNavigation.Screen
						name={"Instruction"}
						component={Screens.Instruction}
						options={{ title: i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750") }}
					/>
					<RootNavigation.Screen
						name={"Payment"}
						component={Screens.Payment}
						options={{ title: i18n.t("35f5ec21-d765-46a5-a33e-ff5b418170fe") }}
					/>

					<RootNavigation.Screen
						name={"InputNameAndSelectGender"}
						component={Screens.InputNameAndSelectGender}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"ByMaySubscribe"}
						component={Screens.ByMaySubscribe}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen name={"ResultSubscribeScreen"} component={Screens.ResultSubscribe} />
					<RootNavigation.Screen
						name={"PlayerMeditationDot"}
						component={Screens.PlayerMeditationDot}
						options={{ title: i18n.t("8106b051-caea-44ff-a001-8636d3596275") }}
					/>
					<RootNavigation.Screen
						name={"NoExitMeditation"}
						component={Screens.NoExitMeditation}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"InstructionForDMD"}
						component={Screens.InstructionForDMD}
						options={{ title: i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750") }}
					/>
					<RootNavigation.Screen
						name={"EndMeditation"}
						component={Screens.EndMeditation}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"ConfirmationRemoveSubs"}
						component={Screens.ConfirmationRemoveSubs}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"ConfirmChangeSubs"}
						component={Screens.ConfirmChangeSubs}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"ExperimentalConfig"}
						component={Screens.ExperimentalConfig}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"ConfirmationSignOut"}
						component={Screens.ConfirmationSignOut}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
				</>
			);
		}
	}

	return (
		<RootNavigation.Navigator
			screenOptions={{
				header: ({ route, options, navigation }) => {
					const insets = useSafeAreaInsets();

					return (
						<View
							style={{
								width: "100%",
								position: "absolute",
								height: 50,
								alignItems: "center",
								flexDirection: "row",
								backgroundColor: "transparent",
								top: insets.top,
							}}
						>
							<View
								style={{
									width: "13%",
									height: "100%",
								}}
							>
								{navigation.canGoBack() ? (
									<Pressable
										style={{
											flex: 1,
											justifyContent: "center",
											alignItems: "flex-start",
											paddingLeft: 20,
										}}
										onPress={() => navigation.goBack()}
									>
										<ArrowBack />
									</Pressable>
								) : null}
							</View>
							<View
								style={{
									width: "74%",
									height: "100%",
									alignItems: "center",
									justifyContent: "center",
									paddingHorizontal: 20,
								}}
							>
								<Text
									style={{
										...gStyle.styles.header,
										color: "#FFFFFF",
										textAlignVertical: "center",
										textAlign: "center",
									}}
									adjustsFontSizeToFit
									numberOfLines={2}
								>
									{options.title}
								</Text>
							</View>

							<View
								style={{
									height: "100%",
									width: "13%",
									justifyContent: "center",
									alignItems: "center",
									paddingRight: 20,
								}}
							>
								{options.headerRight !== undefined ? options.headerRight({}) : null}
							</View>
						</View>
					);
				},
				headerTransparent: true,
			}}
		>
			{screenList}

		</RootNavigation.Navigator>
	);
};

const styles = StyleSheet.create({
	meditationName: {
		color: "#FFFFFF",
		fontSize: 20,
		...Core.gStyle.font("700"),
		textAlign: "center",
		width: "100%",
		height: 20,
	},
	meditationType: {
		color: "#FFFFFF",
		fontSize: 14,
		...Core.gStyle.font("400"),
		textAlign: "center",
	},
	screenLoading: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#9765A8",
	},
	tabBarBackground: {
		flexDirection: "row",
		height: 74,
		backgroundColor: "#FFFFFF",
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
});

export default RootRoutes;
