/** @format */

import React, { FC } from "react";
import { Platform, ScrollView, StyleSheet, View, ViewProps, SafeAreaView } from "react-native";
import * as StatusBar from "expo-status-bar";
// import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Path, Svg } from "react-native-svg";
import { useDimensions } from "@react-native-community/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const heightViewPart2 = 42;

const DoubleColorView: FC<DoubleColorViewProps> = props => {
	const {
		children,
		style,
		heightViewPart = 0,
		hideElementVioletPart = false,
		onFunctionGetPaddingTop,
		onLayout,
		headerElement,
		scroll = false,
	} = props;
	const { window, screen } = useDimensions();

	const insets = useSafeAreaInsets();
	const mainComponent = (
		<View style={[{ flex: 1, backgroundColor: "#FFFFFF", paddingTop: 55 + insets.top }, style]} onLayout={onLayout}>
			{headerElement && (
				<View
					style={{
						position: "absolute",
						zIndex: hideElementVioletPart ? 11 : 1,
						height: 55,
						width: "100%",
						top: insets.top,
					}}
				>
					{headerElement}
				</View>
			)}
			<Svg
				width={window.width}
				height={heightViewPart + Constants.statusBarHeight * 0 + 55 + heightViewPart2 + insets.top}
				style={{ zIndex: hideElementVioletPart ? 10 : 0, position: "absolute" }}
				onLayout={event => {
					if (onFunctionGetPaddingTop) {
						onFunctionGetPaddingTop(
							widthComponent => (widthComponent * heightViewPart2) / window.width + heightViewPart
						);
					}
				}}
			>
				<Path
					d={[
						"M0 0",
						`${window.width} 0`,
						`${window.width} ${heightViewPart + 55 + heightViewPart2 + insets.top}`,
						`0 ${heightViewPart + 55 + insets.top}`,
						`0 0z`,
					].join(" ")}
					fill="#9765A8"
					stroke={"none"}
				/>
			</Svg>
			{children}
		</View>
	);
	return scroll ? (
		<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }} showsVerticalScrollIndicator={false}>
			{mainComponent}
		</ScrollView>
	) : (
		mainComponent
	);
};

export interface DoubleColorViewProps extends ViewProps {
	heightViewPart?: number;
	hideElementVioletPart?: boolean;
	getTopPaddingFirstElement?: number;
	onFunctionGetPaddingTop?: (getPaddingTop: (width: number) => number) => void;
	headerElement?: JSX.Element;
	scroll?: boolean;
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	part1: {
		width: "100%",
	},
	part2: {
		width: "200%",
		height: heightViewPart2,
	},
});

export default DoubleColorView;
