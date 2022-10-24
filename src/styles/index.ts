/** @format */

import { Platform, ShadowStyleIOS, StyleSheet } from "react-native";
import fontStyle, { useCustomFonts, getFontOption } from "./font";
import viewStyle from "./view";
import imageStyle from "./image";
import colors, { setColorOpacity } from "./colors";
import { ToastOptions } from "react-native-root-toast";

function getShadows(offset: number, blur: number): ShadowStyleIOS | { elevation: number } {
	if (Platform.OS == "android") {
		return { elevation: offset };
	} else {
		return {
			shadowOffset: { width: 0, height: offset },
			shadowRadius: blur,
		};
	}
}

export const styleImage = StyleSheet.create({
	imageFullWidth: {
		width: "100%",
		resizeMode: "contain",
	},
});

const toastOptions: ToastOptions = {
	textColor: colors.gray,
	backgroundColor: colors.White,
	shadowColor: colors.DarkGlass,
	containerStyle: {
		borderRadius: 15,
	},
};

export { useCustomFonts, toastOptions, setColorOpacity, fontStyle, viewStyle, imageStyle };

export default {
	font: getFontOption,
	colors,
	shadows: getShadows,
};
