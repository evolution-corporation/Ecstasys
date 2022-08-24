import Roboto, { useFonts } from "@expo-google-fonts/roboto";
import {Platform} from "react-native";
import {FontWeight} from "./type";

export function getFontOption(weight: FontWeight = "normal"): {
	fontFamily: string;
	fontWeight?: FontWeight;
} {
	if (Platform.OS == "android") {
		switch (weight) {
			case "100":
			case "200":
				return { fontFamily: "Roboto_100-200" };
			case "300":
				return { fontFamily: "Roboto_300" };
			case "400":
				return { fontFamily: "Roboto_400" };
			case "500":
			case "normal":
				return { fontFamily: "Roboto_500" };
			case "600":
			case "700":
			case "bold":
				return { fontFamily: "Roboto_600-700" };
			case "800":
			case "900":
				return { fontFamily: "Roboto_800-900" };
		}
	}
	return { fontFamily: "System", fontWeight: weight };
}

const fontFamily = {
	"Roboto_100-200": Roboto.Roboto_100Thin,
	"Roboto_300": Roboto.Roboto_300Light,
	"Roboto_400": Roboto.Roboto_400Regular,
	"Roboto_500": Roboto.Roboto_500Medium,
	"Roboto_600-700": Roboto.Roboto_700Bold,
	"Roboto_800-900": Roboto.Roboto_900Black
}

export function useCustomFonts() {
	return useFonts(fontFamily)
}

