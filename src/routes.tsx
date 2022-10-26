/** @format */

import React, { FC, memo } from "react";
import { StyleSheet } from "react-native";

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
					headerRight: () => <UserButton style={{ marginRight: 20 }} image={image} nickname={nickName} />,
					tabBarIcon: ({ focused }) => (focused ? <PracticesIconSelected /> : <PracticesIconNoSelected />),
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

const RootNavigation = createSharedElementStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
	const accountStatus = useAppSelector(store => store.account.status);
	if (accountStatus === "IS_LOADING") return null;
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
			{accountStatus === "NO_AUTHENTICATION" && (
				<>
					<RootNavigation.Screen name={"SelectMethodAuthentication"} component={Screens.SelectMethodAuthentication} />
				</>
			)}

			{accountStatus === "NO_REGISTRATION" && (
				<>
					<RootNavigation.Screen name={"InputNickname"} component={Screens.InputNickname} />
					<RootNavigation.Screen name={"InputImageAndBirthday"} component={Screens.InputImageAndBirthday} />
					<RootNavigation.Screen name={"Greeting"} component={Screens.Greeting} />
				</>
			)}

			{accountStatus === "REGISTRATION" && (
				<>
					<RootNavigation.Screen name={"TabNavigator"} component={TabRoutes} options={{ headerShown: false }} />
					<RootNavigation.Screen name={"Options"} component={Screens.Options} />
					<RootNavigation.Screen name={"FavoriteMeditation"} component={Screens.FavoriteMeditation} />
					<RootNavigation.Screen name={"EditUser"} component={Screens.EditUser} />
					<RootNavigation.Screen name={"EditUserBirthday"} component={Screens.EditUserBirthday} />
					<RootNavigation.Screen
						name={"DMDSettingNotification"}
						component={Screens.DMDSettingNotification}
						initialParams={{
							optionState: {
								id: "6387521c-adb7-49b7-8a0f-5882eacc35af",
								description: "test",
								image:
									"https://storage.yandexcloud.net/dmdmeditationimage/meditations/00bcbd42-038b-4ef7-95b5-9b8e3a592ef9.png",
								audio: "https://storage.yandexcloud.net/dmdmeditatonaudio/6387521c-adb7-49b7-8a0f-5882eacc35af.mp3",
								instruction: { body: [{ text: "rest" }], description: "te", id: "asd", title: "aseasae" },
								isNeedSubscribe: false,
								length: 1059000,
								name: "test practive",
								type: "RELAXATION",
							},
							setState: {
								audio:
									"https://storage.yandexcloud.net/dmdmeditatonaudio/01.%20%D0%94%D0%9C%D0%94-01-%20%D1%85%D0%BE%D1%80..mp3",
								id: "106e64db-5e50-4326-822a-beb77d6dcdf7",
								length: 4593000,
								name: "TestSet",
							},
						}}
					/>
					<RootNavigation.Screen
						name={"DMDSelectTimeBright"}
						component={Screens.DMDSelectTimeBright}
						options={{ presentation: "transparentModal" }}
					/>
					<RootNavigation.Screen name={"PlayerForDMD"} component={Screens.PlayerForDMD} />

					<RootNavigation.Screen name={"PracticeListByType"} component={Screens.PracticeListByType} />
					<RootNavigation.Screen
						name={"SelectTimeForRelax"}
						component={Screens.SelectTimeForRelax}
						sharedElements={({ params }) => {
							const { id } = params.selectedPractice as State.Practice;
							return [`practice.item.${id}`];
						}}
					/>
					<RootNavigation.Screen
						name={"PlayerForPractice"}
						component={Screens.PlayerForPractice}
						sharedElements={route => {
							const { imageId } = route.params;
							return [{ id: `item.${imageId}`, animation: "move" }];
						}}
					/>
					<RootNavigation.Screen name={"SelectBackgroundSound"} component={Screens.SelectBackgroundSound} />
				</>
			)}
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

export default memo(RootRoutes);
