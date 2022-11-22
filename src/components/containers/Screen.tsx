/** @format */

import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet, ColorValue, StyleProp, ViewStyle, LayoutChangeEvent, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
	headerTransparent?: boolean;
	backgroundColor?: ColorValue;
	children: React.ReactNode;
	styleScreen?: StyleProp<ViewStyle>;
	statusBarHidden?: boolean;
	headerHidden?: boolean;
	paddingHorizontalOff?: boolean;
	onLayout?: (event: LayoutChangeEvent) => void;
}

const Screen: React.FC<Props> = props => {
	const {
		children,
		backgroundColor = "#9765A8",
		headerTransparent = false,
		styleScreen,
		statusBarHidden = false,
		headerHidden = false,
		paddingHorizontalOff = false,
		onLayout,
	} = props;

	useFocusEffect(
		React.useCallback(() => {
			if (Platform.OS === "android") {
				StatusBar.setStatusBarBackgroundColor(headerTransparent ? "transparent" : (backgroundColor as string), false);
				StatusBar.setStatusBarTranslucent(headerTransparent);
			}
			StatusBar.setStatusBarStyle("light");
			StatusBar.setStatusBarHidden(headerHidden, "none");
		}, [headerTransparent, backgroundColor, headerHidden])
	);
	const insets = useSafeAreaInsets();

	return (
		<View
			style={[
				{ flex: 1, backgroundColor, paddingTop: insets.top + (headerHidden ? 0 : 55) },
				paddingHorizontalOff ? null : { paddingHorizontal: 20 },
			]}
			onLayout={onLayout}
		>
			{children}
		</View>
	);
};

Screen.defaultProps = {};

export default Screen;
