/** @format */

import React, { FC, memo } from "react";
import { Dimensions, StyleSheet } from "react-native";

import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Core from "~core";
import i18n from "~i18n";

import * as Screens from "src/screens";

import { ColorButton, UserButton } from "~components/dump";

import TreeLine from "~assets/ThreeLine.svg";

import MainIconSelected from "assets/icons/HomeSelectedIcon.svg";
import PracticesIconSelected from "assets/icons/PracticeSelectedIcon.svg";
import ProfileIconSelected from "assets/icons/ProfileSelectedIcon.svg";
import DMDIconSelected from "assets/icons/DMDSelectedIcon.svg";
import MainIconNoSelected from "assets/icons/HomeNoSelectedIcon.svg";
import PracticesIconNoSelected from "assets/icons/PracticeNoSelectedIcon.svg";
import ProfileIconNoSelected from "assets/icons/ProfileNoSelectedIcon.svg";
import DMDIconNoSelected from "assets/icons/DMDNoSelectedIcon.svg";

import { useAppSelector } from "~store";
import { RootScreenProps, RootStackList, State, TabNavigatorList } from "~types";
import { createStackNavigator } from "@react-navigation/stack";

const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => {
	const { nickName, image } = useAppSelector(store => {
		if (store.account.currentData === undefined) throw new Error("User Not Found");
		return store.account.currentData;
	});
	return (
		<TabNavigator.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: "#9765A8",
				},
				headerTintColor: "#FFFFFF",
				headerShadowVisible: false,
				tabBarShowLabel: false,
				headerTitleStyle: {
					...Core.gStyle.font("700"),
					fontSize: 24,
				},
				tabBarStyle: {
					height: 75,
					width: "100%",
					alignItems: "center",
				},
				tabBarItemStyle: {
					flex: 0,
					paddingHorizontal: 40,
					maxWidth: Dimensions.get("window").width / 4,
				},
			}}
		>
			<TabNavigator.Screen
				name={"Main"}
				component={Screens.Main}
				options={{
					headerTransparent: true,
					headerShown: false,
					tabBarIcon: ({ focused }) => (focused ? <MainIconSelected /> : <MainIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"PracticesList"}
				component={Screens.PracticesList}
				options={{
					title: i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05"),
					headerRight: () => (
						<UserButton
							style={{ marginRight: 20 }}
							image={image}
							nickname={nickName}
							onPress={() => navigation.navigate("Profile")}
						/>
					),
					tabBarIcon: ({ focused }) => (focused ? <PracticesIconSelected /> : <PracticesIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"RelaxListForDMD"}
				component={Screens.RelaxListForDMD}
				options={{
					title: i18n.t("DMD"),
					headerRight: () => (
						<UserButton
							style={{ marginRight: 20 }}
							image={image}
							nickname={nickName}
							onPress={() => navigation.navigate("Profile")}
						/>
					),

					tabBarIcon: ({ focused }) => (focused ? <DMDIconSelected /> : <DMDIconNoSelected />),
				}}
			/>
			<TabNavigator.Screen
				name={"Profile"}
				component={Screens.Profile}
				options={{
					headerRight: () => (
						<ColorButton
							secondItem={<TreeLine />}
							styleButton={{
								backgroundColor: "transparent",
								marginRight: 17,
							}}
							onPress={() => {
								navigation.navigate("Options");
							}}
						/>
					),
					tabBarIcon: ({ focused }) => (focused ? <ProfileIconSelected /> : <ProfileIconNoSelected />),
				}}
			/>
		</TabNavigator.Navigator>
	);
};

const RootNavigation = createStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
	const accountStatus = useAppSelector(store => store.account.status);
	if (accountStatus === "IS_LOADING") return null;
	let screenList;
	switch (accountStatus) {
		case "NO_AUTHENTICATION":
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
						options={{
							title: i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae"),
							headerTitleAlign: "center",
							headerLeft: () => null,
						}}
					/>
					<RootNavigation.Screen name={"InputSMSCode"} component={Screens.InputSMSCode} options={{ title: "" }} />
				</>
			);
			break;
		case "NO_REGISTRATION":
			screenList = (
				<>
					<RootNavigation.Screen
						name={"InputNickname"}
						component={Screens.InputNickname}
						options={{ title: i18n.t("323361e3-4ef1-4935-b3b2-03494b482a77"), headerTitleAlign: "center" }}
					/>
					<RootNavigation.Screen
						name={"InputImageAndBirthday"}
						component={Screens.InputImageAndBirthday}
						options={{
							title: i18n.t("01e5182d-f190-4bcb-9668-36a193e18325"),
							headerTitleAlign: "center",
							headerLeft: () => null,
						}}
					/>

					<RootNavigation.Screen name={"Greeting"} component={Screens.Greeting} options={{ headerShown: false }} />
				</>
			);
			break;
		default:
			screenList = (
				<>
					<RootNavigation.Screen name={"TabNavigator"} component={TabRoutes} options={{ headerShown: false }} />
					<RootNavigation.Screen
						name={"Options"}
						component={Screens.Options}
						options={{ title: i18n.t("options"), headerTitleAlign: "center" }}
					/>
					<RootNavigation.Screen
						name={"FavoriteMeditation"}
						component={Screens.FavoriteMeditation}
						options={{ title: i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1"), headerTitleAlign: "center" }}
					/>
					<RootNavigation.Screen
						name={"EditUser"}
						component={Screens.EditUser}
						options={{ title: i18n.t("Profile"), headerTitleAlign: "center" }}
					/>
					<RootNavigation.Screen
						name={"EditUserBirthday"}
						component={Screens.EditUserBirthday}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"SelectSet"}
						component={Screens.SelectSet}
						options={{ title: i18n.t("DMD"), headerTitleAlign: "center" }}
						// sharedElements={({ params }) => {
						// 	const { id } = params.selectedRelax as State.Practice;
						// 	return [`practice.item.${id}`];
						// }}
					/>
					<RootNavigation.Screen
						name={"DMDSettingNotification"}
						component={Screens.DMDSettingNotification}
						options={{ headerTitleAlign: "center", headerTransparent: true }}
					/>
					<RootNavigation.Screen
						name={"DMDSelectTimeBright"}
						component={Screens.DMDSelectTimeBright}
						options={{ presentation: "transparentModal", headerShown: false }}
					/>
					<RootNavigation.Screen
						name={"PlayerForDMD"}
						component={Screens.PlayerForDMD}
						options={{
							headerTransparent: true,
							headerTitleAlign: "center",
						}}
					/>

					<RootNavigation.Screen
						name={"PracticeListByType"}
						component={Screens.PracticeListByType}
						options={{ headerTitleAlign: "center" }}
					/>
					<RootNavigation.Screen
						name={"SelectTimeForRelax"}
						component={Screens.SelectTimeForRelax}
						options={{ headerTitleAlign: "center", headerTransparent: true }}

						// sharedElements={({ params }) => {
						// 	const { id } = params.selectedPractice as State.Practice;
						// 	return [`practice.item.${id}`];
						// }}
					/>
					<RootNavigation.Screen
						name={"PlayerForRelaxation"}
						component={Screens.PlayerForRelaxation}
						options={{
							headerTransparent: true,
							headerTitleAlign: "center",
						}}
						// sharedElements={route => {
						// 	const { imageId } = route.params;
						// 	return [{ id: `item.${imageId}`, animation: "move" }];
						// }}
					/>
					<RootNavigation.Screen
						name={"SelectBackgroundSound"}
						component={Screens.SelectBackgroundSound}
						options={{
							headerTransparent: true,
							headerTitleAlign: "center",
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
				</>
			);
	}
	{
	}
	return (
		<RootNavigation.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: "#9765A8",
				},
				headerTintColor: "#FFFFFF",
				headerShadowVisible: false,
				headerTitleStyle: {
					...Core.gStyle.font("700"),
					fontSize: 24,
				},
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
