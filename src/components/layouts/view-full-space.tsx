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

export interface ViewFullSpaceProperties {
	style?: StyleProp<Omit<ViewStyle, "flex" | "justifyContent" | "flexDirection" | "width" | "height">>;
	mainPositionElements?: PositionElements;
	direction: Direction;
	children: JSX.Element | JSX.Element[];
}

const ViewFullSpace: React.FC<ViewFullSpaceProperties> = properties => {
	const { style, mainPositionElements = PositionElements.Center, direction, children } = properties;
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
	return <View style={[style, { width: "100%", height: "100%", justifyContent, flexDirection }]}>{children}</View>;
};

export default ViewFullSpace;
