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
import Colors from "./colors";

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

const title = StyleSheet.create({
	/** fontSize: 32, weight: 700 */
	h1_Iter: {
		fontFamily: "Inter_700Bold",
		fontSize: 32,
	},
	/** fontSize: 24, weight: 600 */
	h1_Roboto: {
		fontSize: 24,
		...getFontOption("600"),
	},
	/** fontSize: 20, weight: 700 */
	h2_Roboto: {
		fontSize: 20,
		...getFontOption("700"),
	},
	/** fontSize: 20, weight: 600 */
	h2_5_Roboto: {
		fontSize: 20,
		...getFontOption("600"),
	},
	/** fontSize: 20, weight: 500 */
	h2_7_Roboto: {
		fontSize: 20,
		...getFontOption("500"),
	},
	/** fontSize: 20, weight: 500 */
	h3_Roboto: {
		fontSize: 20,
		...getFontOption("400"),
	},
});

const addiction = StyleSheet.create({
	/** fontSize: 12, weight: 400 */
	light: {
		fontSize: 12,
		...getFontOption("400"),
	},
	/** fontSize: 12, weight: 500 */
	small: {
		fontSize: 12,
		...getFontOption("500"),
	},
	/** fontSize: 13, weight: 400 */
	regular: {
		fontSize: 13,
		...getFontOption("400"),
	},
	/** fontSize: 14, weight: 400 */
	medium: {
		fontSize: 14,
		...getFontOption("400"),
	},
	/** fontSize: 14, weight: 400 */
	semiBold: {
		fontSize: 16,
		...getFontOption("400"),
	},
});

const description = StyleSheet.create({
	/** fontSize: 12, weight: 500 */
	extraLight: {
		fontSize: 12,
		...getFontOption("500"),
	},
	/** fontSize: 13, weight: 500 */
	light: {
		fontSize: 12,
		...getFontOption("500"),
	},
	/** fontSize: 14, weight: 400 */
	regular: {
		fontSize: 14,
		...getFontOption("400"),
	},
	/** fontSize: 16, weight: 400 */
	medium: {
		fontSize: 16,
		...getFontOption("400"),
	},
});

const colors = StyleSheet.create({
	darkLetters: {
		color: Colors.DarkLetters,
	},
	noName1: {
		color: Colors.noName1,
	},
	white: {
		color: Colors.White,
	},
});

export default { title, addiction, description, ...colors };
