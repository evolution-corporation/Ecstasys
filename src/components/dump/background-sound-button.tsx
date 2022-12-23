/** @format */

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import useBackgroundSound from "src/hooks/use-background-sound";
import gStyle from "~styles";
import Headphones from "assets/icons/Headphones_white.svg";
import { useNavigation } from "@react-navigation/native";

interface BackgroundSoundButtonProperty {
  onPress?: () => void
}

const BackgroundSoundButton: React.FC<BackgroundSoundButtonProperty> = property => {
	const nameBackgroundSound = useBackgroundSound();
  const navigation = useNavigation()
  const { onPress= () => navigation.navigate('SelectBackgroundSound') } = property
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
				{nameBackgroundSound}{" "}
			</Text>
		</View>
	);
};

BackgroundSoundButton.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default BackgroundSoundButton;
