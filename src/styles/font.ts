/** @format */

import { useFonts } from "expo-font";
import {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

import { Platform, StyleSheet } from "react-native";
import { FontWeight } from "./type";

export function getFontOption(weight: FontWeight = "normal"): {
	fontFamily: string;
	fontWeight?: FontWeight;
} {
	if (Platform.OS == "android") {
		switch (weight) {
			case "100":
			case "200":
				return { fontFamily: "Roboto_100Thin" };
			case "300":
				return { fontFamily: "Roboto_300Light" };
			case "400":
				return { fontFamily: "Roboto_400Regular" };
			case "500":
			case "normal":
				return { fontFamily: "Roboto_500Medium" };
			case "600":
			case "700":
			case "bold":
				return { fontFamily: "Roboto_700Bold" };
			case "800":
			case "900":
				return { fontFamily: "Roboto_900Black" };
		}
	}
	return { fontFamily: "System", fontWeight: weight };
}

const fontFamily = {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
	Inter_700Bold,
};

export const useCustomFonts = () => useFonts(fontFamily);

export const styles = StyleSheet.create({
	title: {
		fontSize: 32,
		fontFamily: "Inter_700Bold",
		lineHeight: 39,
		width: "100%",
		textAlign: "left",
		textAlignVertical: "center",
	},
	subTitle: {
		fontSize: 20,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto_500Medium",
		fontWeight: "600",
		lineHeight: 23.44,
		width: "100%",
		textAlign: "center",
		textAlignVertical: "auto",
	},
	header: {
		//! adjustsFontSizeToFit: true
		fontSize: 24,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto_700Bold",
		fontWeight: "600",
		width: "74%",
		maxHeight: "100%",
	},
	description: {
		//! numberLines 2 or 0
		fontSize: 16.5,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto_400Regular",
		lineHeight: 23,
		fontWeight: "400",
	},
	namePractice: {
		//! adjustsFontSizeToFit: true
		fontSize: 24,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto_700Bold",
		fontWeight: "600",
		lineHeight: 28.13,
		textAlignVertical: "center",
	},
	default: {
		fontSize: 14,
		fontWeight: "400",
		lineHeight: 16.41,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto_400Regular",
	},
	name: {
		fontSize: 20,
		fontWeight: "600",
		lineHeight: 23.44,
		width: "auto",
	},
});

export default {};
