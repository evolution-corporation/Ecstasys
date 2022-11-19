/** @format */

import React, { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Path, Svg } from "react-native-svg";
import { useDimensions } from "@react-native-community/hooks";

export const heightViewPart2 = 42;

const DoubleColorView: FC<DoubleColorViewProps> = props => {
	const {
		children,
		style,
		heightViewPart = 0,
		hideElementVioletPart = false,
		onFunctionGetPaddingTop,
		onLayout,
	} = props;
	const { window } = useDimensions();

	return (
		<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<StatusBar style="light" backgroundColor={"transparent"} translucent={false} />

			<SafeAreaView style={[styles.background, style]} onLayout={onLayout}>
				<Svg
					width={window.width}
					height={heightViewPart + Constants.statusBarHeight + 55 + heightViewPart2}
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
							`${window.width} ${heightViewPart + 55 + heightViewPart2}`,
							`0 ${heightViewPart + 55}`,
							`0 0z`,
						].join(" ")}
						fill="green"
						stroke={"none"}
					/>
				</Svg>
				{children}
			</SafeAreaView>
		</View>
	);
};

export interface DoubleColorViewProps extends ViewProps {
	heightViewPart?: number;
	hideElementVioletPart?: boolean;
	getTopPaddingFirstElement?: number;
	onFunctionGetPaddingTop?: (getPaddingTop: (width: number) => number) => void;
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		paddingTop: 55,
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
