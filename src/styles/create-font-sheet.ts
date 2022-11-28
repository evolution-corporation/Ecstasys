/** @format */

import { TextStyle } from "react-native";

import getFontOption from "./get-font-option";

import Fonts from "config/fonts.json";

export interface ConfigStyle extends TextStyle {
	adjustsFontSizeToFit?: boolean;
	numberLines?: number[];
}
export type ConfigFile = { [NameStyle: string]: ConfigStyle };

export default () => {
	const fontsStylesAtArray: [string, object][] = Object.entries(Fonts);
	const fontsObject = Fonts as ConfigFile;
	for (const fontStyleOptionIndex in fontsStylesAtArray) {
		const [nameStyle, valueStyle] = fontsStylesAtArray[fontStyleOptionIndex];
		fontsStylesAtArray[fontStyleOptionIndex] = [
			nameStyle,
			Object.fromEntries(
				Object.entries(valueStyle)
					.map(([nameField, valueField]) => {
						if (nameField === "fontFamily" && valueField === "System") {
							const fontWeight = fontsObject[nameStyle]?.fontWeight ?? "normal";
							const fontName = getFontOption(fontWeight).fontFamily;
							return [nameField, fontName];
						}
						if (nameField === "adjustsFontSizeToFit" || nameField === "numberLines") {
							return [nameField, undefined];
						}
						return [nameField, valueField];
					})
					.filter(fontStyleOption => fontStyleOption[1] !== undefined)
			),
		];
	}
	return Object.fromEntries(fontsStylesAtArray);
};
