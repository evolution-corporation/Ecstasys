import React from "react";
import { View, ViewProps } from "react-native";

const ViewCenter: React.FC<ViewProps> = properties => (
	<View {...properties} style={[properties.style, { alignItems: "center", justifyContent: "center" }]} />
);

ViewCenter.defaultProps = {};

export default ViewCenter;
