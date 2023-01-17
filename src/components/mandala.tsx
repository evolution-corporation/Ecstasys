/** @format */

import React from "react";
import { Image, StyleSheet, Animated, ImageSourcePropType } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

interface MandalaProperty {
	image: ImageSourcePropType;
}

const Mandala: React.FC<MandalaProperty> = property => {
	const { image } = property;

	const rotateMandala = useSharedValue("0deg");

	const styleMandala = useAnimatedStyle(() => ({
		transform: [{ rotate: rotateMandala.value }],
		position: "absolute",
		width: "100%",
		height: "100%",
	}));
	return (
		<Animated.View style={styleMandala}>
			<Image source={image} style={{ width: "100%", height: "100%" }} />
		</Animated.View>
	);
};

export default Mandala;
