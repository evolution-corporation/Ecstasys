/** @format */

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleProp, ViewStyle, Pressable } from "react-native";

export enum PositionContentBlock {
	Bottom,
	Center,
}

export interface ScreenModalProperties {
	styleContentBlock?: StyleProp<Omit<ViewStyle, "flex">>;
	styleNoContentElement?: StyleProp<Omit<ViewStyle, "position" | "width" | "height">>;
	children: JSX.Element | JSX.Element[];
	positionContentBlock?: PositionContentBlock;
	onPress?: () => void;
}

const ScreenModal: React.FC<ScreenModalProperties> = properties => {
	const navigation = useNavigation();
	const {
		styleContentBlock,
		onPress = () => navigation.goBack(),
		styleNoContentElement,
		children,
		positionContentBlock = PositionContentBlock.Center,
	} = properties;

	const justifyContent = positionContentBlock === PositionContentBlock.Center ? "center" : "flex-end";

	return (
		<View style={[styleNoContentElement, { flex: 1, justifyContent, alignItems: "center" }]}>
			<Pressable onPress={onPress} style={{ position: "absolute", width: "100%", height: "100%" }} />
			<View style={styleContentBlock}>{children}</View>
		</View>
	);
};

export default ScreenModal;
