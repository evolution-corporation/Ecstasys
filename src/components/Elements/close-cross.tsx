/** @format */

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ViewStyle, StyleProp } from "react-native";
import Close from "assets/Menu/Close_MD.svg";

export interface CloseCrossProperty {
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

const CloseCross: React.FC<CloseCrossProperty> = property => {
	const navigation = useNavigation();
	const { onPress = () => navigation.goBack(), style } = property;
	return (
		<Pressable style={[{ position: "absolute", top: 10, right: 10 }, style]} onPress={onPress}>
			<Close />
		</Pressable>
	);
};

export default CloseCross;
