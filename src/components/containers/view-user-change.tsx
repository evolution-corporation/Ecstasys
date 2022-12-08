/** @format */

import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { AnimatedStyleProp } from "react-native-reanimated";

export interface ViewUserChangeProperty {
	children: JSX.Element | JSX.Element[];
	animatedStyle?: AnimatedStyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(240, 242, 238, 0.19)",
		borderColor: "#C2A9CE",
		borderWidth: 1,
		borderRadius: 15,
		width: "100%",
		height: 45,
		paddingHorizontal: 14,
	},
});

const ViewUserChange: React.FC<ViewUserChangeProperty> = property => {
	const { children, animatedStyle } = property;
	return (
		<Animated.View style={[styles.container, { flexDirection: "row", alignItems: "center" }, animatedStyle]}>
			{children}
		</Animated.View>
	);
};

export const styleViewUserChange = styles.container;
export default ViewUserChange;
