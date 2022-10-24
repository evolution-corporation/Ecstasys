/** @format */

import React, { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import RootRoutes from "./routes";
import Store, { actions } from "./store";
import "./TaskManager";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}
const AppCore = () => {
	const isLoaded = React.useRef<boolean>(false);
	React.useEffect(() => {
		console.info(isLoaded.current, "isLoadedApp");
		if (!isLoaded.current) {
			(async () => {
				await SplashScreen.preventAutoHideAsync();
				await Store.dispatch(actions.initialization()).unwrap();
				isLoaded.current = true;
				await SplashScreen.hideAsync();
			})();
		}
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<RootRoutes />
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

export default () => (
	<Provider store={Store}>
		<AppCore />
	</Provider>
);
