import {useFonts} from "expo-font";
import { Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black } from "@expo-google-fonts/roboto";
import { Platform } from "react-native";
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
	Roboto_900Black
}

export const useCustomFonts = () => useFonts(fontFamily)


