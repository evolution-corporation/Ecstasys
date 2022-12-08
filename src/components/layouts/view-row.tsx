/** @format */

import React from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

export interface ViewRowProperty extends ViewProps {
	style?: StyleProp<Omit<ViewStyle, "flexDirection">>;
}

const ViewRow: React.FC<ViewRowProperty> = property => (
	<View {...property} style={[property, { flexDirection: "row" }]} />
);

export default ViewRow;
