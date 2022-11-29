import React from "react";
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import type { ColorName } from "src/styles";
import { getNameStyleForLayout } from "src/styles/create-color-sheet";

export interface ScreenProperties {
	headerTransparent?: boolean;
	backgroundColor?: ColorName;
	children: React.ReactNode;
	styleScreen?: StyleProp<ViewStyle>;
	statusBarHidden?: boolean;
	headerHidden?: boolean;
	paddingHorizontalOff?: boolean;
	onLayout?: (event: LayoutChangeEvent) => void;
}

const Screen: React.FC<ScreenProperties> = properties => {
	const {
		children,
		backgroundColor = "primary",
		headerTransparent = false,
		styleScreen,
		headerHidden = false,
		paddingHorizontalOff = false,
		onLayout,
	} = properties;

	const BackgroundColor = React.useMemo(
		() => global.GlobalStyleSheet[getNameStyleForLayout(backgroundColor)],
		[backgroundColor]
	);

	useFocusEffect(
		React.useCallback(() => {
			// if (Platform.OS === "android") {
			// 	StatusBar.setStatusBarBackgroundColor(headerTransparent ? "transparent" : (BackgroundColor as string), false);
			// 	StatusBar.setStatusBarTranslucent(headerTransparent);
			// }
			// StatusBar.setStatusBarStyle("light");
			// StatusBar.setStatusBarHidden(headerHidden, "none");
		}, [headerTransparent, backgroundColor, headerHidden])
	);
	const { top } = useSafeAreaInsets();

	return (
		<View
			style={[
				{ flex: 1, ...BackgroundColor, paddingTop: top + (headerHidden ? 0 : 55) },
				paddingHorizontalOff ? undefined : { paddingHorizontal: 20 },
				styleScreen,
			]}
			onLayout={onLayout}
		>
			{children}
		</View>
	);
};

Screen.defaultProps = {};

export default Screen;
