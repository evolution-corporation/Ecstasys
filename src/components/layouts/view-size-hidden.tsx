/** @format */

import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

interface ViewSizeHiddenProperties {
	children: JSX.Element;
	style?: StyleProp<Omit<ViewStyle, "overflow">>;
}

const ViewSizeHidden: React.FC<ViewSizeHiddenProperties> = properties => {
	const { children, style } = properties;
	return <View style={[style, { overflow: "hidden" }]}>{children}</View>;
};

export default ViewSizeHidden;
