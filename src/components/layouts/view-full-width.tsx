/** @format */

import React from "react";
import { View, StyleProp, ViewStyle, FlexStyle } from "react-native";

export enum Direction {
	TopBottom,
	BottomTop,
	LeftRight,
	RightLeft,
}

export enum PositionElements {
	Center,
	StartEnd,
	Start,
}

export interface ViewFullWidthProperties {
	style?: StyleProp<Omit<ViewStyle, "flex" | "justifyContent" | "flexDirection" | "width">>;
	mainPositionElements?: PositionElements;
	direction: Direction;
	children: JSX.Element | JSX.Element[];
	standardHorizontalPadding?: boolean;
}

const ViewFullWidth: React.FC<ViewFullWidthProperties> = properties => {
	const {
		style,
		mainPositionElements = PositionElements.Center,
		direction,
		children,
		standardHorizontalPadding = false,
	} = properties;
	const justifyContent: FlexStyle["justifyContent"] =
		mainPositionElements === PositionElements.Center
			? "center"
			: mainPositionElements === PositionElements.StartEnd
			? "space-between"
			: "flex-start";
	const flexDirection: FlexStyle["flexDirection"] =
		direction === Direction.TopBottom
			? "column"
			: direction === Direction.BottomTop
			? "column-reverse"
			: direction === Direction.RightLeft
			? "row-reverse"
			: "row";
	const paddingHorizontal = standardHorizontalPadding ? 20 : undefined;

	return <View style={[style, { width: "100%", justifyContent, flexDirection, paddingHorizontal }]}>{children}</View>;
};

export default ViewFullWidth;
