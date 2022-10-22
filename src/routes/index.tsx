/** @format */

import React, { FC, memo } from "react";
import { StyleSheet } from "react-native";

import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Core from "~core";

import * as Screens from "~components/screens";

import { ColorButton, UserButton } from "~components/dump";

import TreeLine from "~assets/ThreeLine.svg";

import MainIcon from "./assets/HomeIcon";
import PracticesIcon from "./assets/PracticesIcon";
import ProfileIcon from "./assets/ProfileIcon";
import { useAppDispatch, useAppSelector } from "~store";
import { AccountStatus, RootScreenProps, RootStackList, TabNavigatorList } from "~types";
import { Account } from "src/models";

const TabNavigator = createBottomTabNavigator<TabNavigatorList>();

const TabRoutes: RootScreenProps<"TabNavigator"> = ({ navigation }) => {
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
					tabBarIcon: ({ focused, color }) => (
						<MainIcon colorIcon={focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"} />
					),
				}}
			/>
			<TabNavigator.Screen
				name={"PracticesList"}
				component={Screens.PracticesList}
				options={{
					title: Core.i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05"),
					headerRight: () => <UserButton style={{ marginRight: 20 }} />,
					tabBarIcon: ({ focused }) => (
						<PracticesIcon colorIcon={focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"} />
					),
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
								navigation.navigate("OptionsProfile");
							}}
						/>
					),
					tabBarIcon: ({ focused }) => (
						<ProfileIcon colorIcon={focused ? "rgba(112, 45, 135, 1)" : "rgba(158, 158, 158, 1)"} />
					),
				}}
			/>
		</TabNavigator.Navigator>
	);
};

// const MeditationPractices =
//   createNativeStackNavigator<MeditationPracticesList>();

// export const MeditationPracticesRoutes: RootScreenProps<"ListenMeditation"> = ({
//   route,
// }) => {
//   const { meditationId } = route.params;
//   const [meditation, setMeditation] = useState<MeditationModels | null>(null);

//   useEffect(() => {
//     const init = async () => {
//       const meditation = await API.getMeditationById(meditationId);
//       let _meditation: MeditationModels | undefined;
//       switch (meditation.type) {
//         case "relaxation":
//           if (meditation.audio !== undefined) {
//             _meditation = new Relax(
//               meditation.id,
//               meditation.name,
//               meditation.description,
//               meditation.image,
//               {
//                 length: meditation.lengthAudio,
//                 sound: (
//                   await Audio.Sound.createAsync(
//                     { uri: meditation.audio },
//                     { isLooping: true }
//                   )
//                 ).sound,
//               }
//             );
//           }
//           break;
//         case "directionalVisualizations":
//           if (meditation.audio !== undefined) {
//             _meditation = new Vision(
//               meditation.id,
//               meditation.name,
//               meditation.description,
//               meditation.image,
//               {
//                 length: meditation.lengthAudio,
//                 sound: (
//                   await Audio.Sound.createAsync(
//                     { uri: meditation.audio },
//                     { isLooping: true }
//                   )
//                 ).sound,
//               }
//             );
//           }

//           break;
//         default:
//           break;
//       }
//       if (_meditation) setMeditation(_meditation);
//     };
//     init();
//   }, [meditationId]);

//   const { getItem, setItem } = useAsyncStorage("@StatisticsMeditation");

//   useFocusEffect(
//     useCallback(() => {
//       const close = async (_meditation: MeditationModels) => {
//         const statisticsAS = await getItem();
//         const statistics: { timeLength: number; time: Date }[] = [];
//         if (_meditation) {
//           if (statisticsAS !== null) {
//             const jsnoParse: { timeLength: number; time: Date }[] = JSON.parse(
//               statisticsAS
//             ).map((item: { timeLength: number; time: string }) => ({
//               ...item,
//               time: new Date(item.time),
//             }));
//             statistics.splice(0, 0, ...jsnoParse, {
//               timeLength: _meditation.getPosition(),
//               time: new Date(),
//             });
//           } else {
//             statistics.push({
//               timeLength: _meditation.getPosition(),
//               time: new Date(),
//             });
//           }
//           setItem(JSON.stringify(statistics));
//           await _meditation.stop();
//         }
//       };
//       return () => {
//         if (meditation !== null) {
//           close(meditation).catch(console.error);
//         }
//       };
//     }, [meditation])
//   );

//   if (meditation == null)
//     return (
//       <View style={styles.screenLoading}>
//         <ActivityIndicator color={"#FFFFFF"} />
//       </View>
//     );
//   return (
//     <Meditation meditation={meditation}>
//       <MeditationPractices.Navigator
//         screenOptions={{
//           headerTitle: () => (
//             <View>
//               <Text style={styles.meditationName} adjustsFontSizeToFit>
//                 {meditation.name}
//               </Text>
//               <Text style={styles.meditationType}>
//                 {Core.i18n.t(meditation.typeMeditation)}
//               </Text>
//             </View>
//           ),
//           headerRight: () => null,
//           headerTransparent: true,
//           headerTintColor: "#FFFFFF",
//           headerTitleAlign: "center",
//           headerTitleStyle: {
//             ...Core.gStyle.font("700"),
//             fontSize: 24,
//           },
//         }}
//         initialRouteName={
//           meditation.typeMeditation === "directionalVisualizations"
//             ? "PlayerScreen"
//             : "TimerPractices"
//         }
//       >
//         <MeditationPractices.Screen
//           name={"TimerPractices"}
//           component={Screens.TimerPractices}
//         />
//         <MeditationPractices.Screen
//           name={"PlayerScreen"}
//           component={Screens.PlayerMeditationPractices}
//           options={{
//             headerRight: () => (
//               <FavoriteMeditation
//                 idMeditation={meditationId}
//                 displayWhenNotFavorite
//               />
//             ),
//           }}
//         />
//         <MeditationPractices.Screen
//           name={"BackgroundSound"}
//           component={Screens.BackgroundSound}
//           options={{
//             headerTitle: undefined,
//             title: Core.i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90"),
//           }}
//         />
//       </MeditationPractices.Navigator>
//     </Meditation>
//   );
// };

const RootNavigation = createSharedElementStackNavigator<RootStackList>();

const RootRoutes: FC = () => {
	const accountStatus = useAppSelector(state => Account.createByState(state.account).status);
	if (accountStatus === undefined) return null;
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
			{accountStatus === AccountStatus.NO_AUTHENTICATION && (
				<>
					<RootNavigation.Screen name={"Greeting"} component={Screens.Greeting} />
					<RootNavigation.Screen name={"SelectMethodAuthentication"} component={Screens.SelectMethodAuthentication} />
				</>
			)}

			{accountStatus === AccountStatus.NO_REGISTRATION && (
				<>
					<RootNavigation.Screen name={"InputNickname"} component={Screens.InputNickname} />
					<RootNavigation.Screen name={"InputImageAndBirthday"} component={Screens.InputImageAndBirthday} />
				</>
			)}

			{accountStatus === AccountStatus.REGISTRATION && (
				<>
					<RootNavigation.Screen name={"TabNavigator"} component={TabRoutes} options={{ headerShown: false }} />
					<RootNavigation.Screen name={"PracticeListByType"} component={Screens.PracticeListByType} />
					<RootNavigation.Screen name={"OptionsProfile"} component={Screens.OptionsProfile} />
					<RootNavigation.Screen name={"FavoriteMeditation"} component={Screens.FavoriteMeditation} />
					<RootNavigation.Screen name={"EditMainUserData"} component={Screens.EditMainUserData} />
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

					<RootNavigation.Screen
						name={"PlayerForPractice"}
						component={Screens.PlayerForPractice}
						initialParams={{
							practiceState: {
								id: "6387521c-adb7-49b7-8a0f-5882eacc35af",
								description: "test",
								image:
									"https://storage.yandexcloud.net/dmdmeditationimage/meditations/00bcbd42-038b-4ef7-95b5-9b8e3a592ef9.png",
								audio: "https://storage.yandexcloud.net/dmdmeditatonaudio/6387521c-adb7-49b7-8a0f-5882eacc35af.mp3",
								instruction: { body: [{ text: "rest" }], description: "te", id: "asd", title: "aseasae" },
								isNeedSubscribe: false,
								length: 100000,
								name: "test practive",
								type: "RELAXATION",
							},
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
