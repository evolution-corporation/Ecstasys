/** @format */

import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet, ColorValue, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
	return (
		<View style={{ flex: 1, backgroundColor }}>
			<StatusBar
				style="light"
				backgroundColor={headerTransparent ? "transparent" : (backgroundColor as string)}
				hidden={statusBarHidden}
				translucent={headerTransparent}
			/>
			<SafeAreaView
				style={[
					styleScreen,
					{ flex: 1, marginTop: headerHidden ? 0 : 55 },
					paddingHorizontalOff ? null : { paddingHorizontal: 20 },
				]}
				onLayout={onLayout}
			>
				{children}
			</SafeAreaView>
		</View>
	);
};

Screen.defaultProps = {};

export default Screen;
