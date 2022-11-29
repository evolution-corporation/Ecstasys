import React from "react";
import { View, ViewProps } from "react-native";

export interface ViewStartEndCenterProperties extends ViewProps {
	row?: boolean;
	reverse?: boolean;
}

const ViewStartEndCenter: React.FC<ViewStartEndCenterProperties> = properties => {
	const { row = false, reverse = false, style } = properties;
	let flexDirection: "row" | "column" | "row-reverse" | "column-reverse" = row ? "row" : "column";
	if (reverse) flexDirection = flexDirection === "column" ? "column-reverse" : "row-reverse";
	return (
		<View
			{...properties}
			style={[style, { alignItems: "center", justifyContent: "space-between", flexDirection: flexDirection }]}
		/>
	);
};

ViewStartEndCenter.defaultProps = {};

export default ViewStartEndCenter;
