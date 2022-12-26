/** @format */

import React from "react";
import { View, Text, StyleSheet, Pressable, ImageSourcePropType } from "react-native";
import useBackgroundSound from "src/hooks/use-background-sound";
import gStyle from "~styles";
import Headphones from "assets/icons/Headphones_white.svg";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import BackgroundSound from "src/backgroundSound";

export interface BackgroundSoundButtonProperty {
	image?: ImageSourcePropType;
	name: string;
}

const BackgroundSoundButton: React.FC<BackgroundSoundButtonProperty> = property => {
	const navigation = useNavigation();
	const { image, name } = property;

	return (
		<Pressable
			style={{
				backgroundColor: "rgba(255, 255, 255, 0.5)",
				paddingRight: 33,
				paddingLeft: 13,
				height: 50,
				borderRadius: 25,
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			}}
			onPress={() => {
				navigation.navigate("SelectBackgroundSound", { backgroundImage: image });
			}}
		>
			<Headphones style={{ marginRight: 24 }} />
			<Text
				style={{
					color: "#FFFFFF",
					...gStyle.font("500"),
					fontSize: 14,
				}}
			>
				{" "}
				{name}{" "}
			</Text>
		</Pressable>
	);
};

export default BackgroundSoundButton;
