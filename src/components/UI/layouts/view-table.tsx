import React from "react";
import { View, ViewProps } from "react-native";

export interface ViewTableProperties extends ViewProps {
	column?: boolean;
}

const ViewTable: React.FC<ViewTableProperties> = properties => {
	const { column = false, style } = properties;
	const flexDirection: "row" | "column" = column ? "column" : "row";
	return (
		<View
			{...properties}
			style={[
				style,
				{ alignItems: "center", justifyContent: "space-between", flexDirection: flexDirection, flexWrap: "wrap" },
			]}
		/>
	);
};

ViewTable.defaultProps = {};

export default ViewTable;
