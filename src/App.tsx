/** @format */

import React, { FC, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, UIManager, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import RootRoutes from "./routes";
import Store, { actions, useAppSelector } from "./store";
import { MessageProfessor } from "./models";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}
const AppCore: FC<Props> = props => {
	const moduleIsLoaded = useAppSelector(
		store => store.account.isLoaded && store.style.loaded && store.favoritePractices.loaded && store.statistic.loaded
	);

	useEffect(() => {
		console.log("reRender");
		(async () => {
			await SplashScreen.preventAutoHideAsync();
			await Store.dispatch(actions.initialization()).unwrap();
		})();
	});

	useEffect(() => {
		if (moduleIsLoaded) {
			SplashScreen.hideAsync();
		} else {
			SplashScreen.preventAutoHideAsync();
		}
	}, [moduleIsLoaded]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<RootRoutes />
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

interface Props {}

export default () => (
	<Provider store={Store}>
		<AppCore />
	</Provider>
);
