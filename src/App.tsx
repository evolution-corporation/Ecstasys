/** @format */

import React, { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, Platform, UIManager, View } from "react-native";
import { Provider } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import RootRoutes, { ApplicationRoutes } from "./routes";
import Store from "./core/redux/Store";
import "./TaskManager";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "./notification";
import Constants from "expo-constants";

import { adapty } from "react-native-adapty";
const { extra } = Constants.manifest ?? {};
const { isDebug } = extra;

import "./core/effects/FirebaseEffect"

GoogleSignin.configure({
	webClientId: "878799007977-cj3549ni87jre2rmg4eq0hiolp08igh2.apps.googleusercontent.com",
	offlineAccess: true
});


const AppCore = () => {
	// React.useEffect(() => {
	// 	if (Platform.OS === "ios")
	// 		adapty.activate(
	// 			isDebug ? "public_live_B5WK9eoU.NdcH8xOtr823XuWjQkgQ" : "public_live_yQp6zUhg.9v0LCJV8Yj5AfYeruMqt"
	// 		); //adapty key
	// 	(async () => {
	// 		await SplashScreen.preventAutoHideAsync();
	// 		try {
	// 			await Store.dispatch(actions.initialization()).unwrap();

	// 			await SplashScreen.hideAsync();
	// 		} catch (error) {
	// 			if (error instanceof Error) Alert.alert(`Ошибка при загрузке. ${error.name}`, error.message);
	// 		}
	// 	})();
	// }, []);

	return (
		<SafeAreaProvider>
			<StatusBar backgroundColor={"#9765a8"} style={"light"} />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ApplicationRoutes />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

export default () => (
	<Provider store={Store}>
		<AppCore />
	</Provider>
);
