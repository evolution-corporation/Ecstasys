import { Platform } from "react-native";

export type FontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export interface FontStyle {
	fontFamily: string;
	fontWeight?: FontWeight;
}
export default (weight: FontWeight = "normal") => {
	if (Platform.OS == "android") {
		switch (weight) {
			case "100":
			case "200": {
				return { fontFamily: "Roboto_100Thin" };
			}
			case "300": {
				return { fontFamily: "Roboto_300Light" };
			}
			case "400": {
				return { fontFamily: "Roboto_400Regular" };
			}
			case "500":
			case "normal": {
				return { fontFamily: "Roboto_500Medium" };
			}
			case "600":
			case "700":
			case "bold": {
				return { fontFamily: "Roboto_700Bold" };
			}
			case "800":
			case "900": {
				return { fontFamily: "Roboto_900Black" };
			}
		}
	}
	return { fontFamily: "System", fontWeight: weight } as FontStyle;
};
