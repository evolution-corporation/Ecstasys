/** @format */

import { ColorValue, StyleSheet } from "react-native";

export function setColorOpacity(color: ColorValue, opacity: number = 0.5) {
	let r: number | undefined = undefined;
	let g: number | undefined = undefined;
	let b: number | undefined = undefined;
	let o: number = opacity;
	const color_str = color.toString();
	if (color_str.indexOf("#") !== -1) {
		const bigint = parseInt(color_str.split("#")[1], 16);
		r = (bigint >> 16) & 255;
		g = (bigint >> 8) & 255;
		b = bigint & 255;
	} else if (color_str.indexOf("rgb") !== -1) {
		const rgb = color_str.replace(/rgba?/, "").replace("(", "").replace(")", "").split(",");
		if (rgb && rgb.length >= 3) {
			r = parseInt(rgb[0], 10);
			g = parseInt(rgb[1], 10);
			b = parseInt(rgb[2], 10);
			if (rgb.length === 4) {
				o = Number(rgb[3]) * o;
			}
		}
	}
	if (typeof r === "undefined") r = 0;
	if (typeof g === "undefined") g = 0;
	if (typeof b === "undefined") b = 0;
	return `rgba(${r}, ${g}, ${b}, ${o})`;
}

export const Colors = {
	primary: "#9765A8",
	second: "#F3F3F3",
	WHITE: "#FFFFFF",
	GRAY: "#3D3D3D",
	YELLOW: "#FBBC05",
	TRACING: "#C2A9CE",
	TEXT_BACKGROUND: "#E7DDEC",
	DARK_LETTERS: "#555555",
	GREEN: "#8BBA47",
	ORANGE: "#FF5C00",
	VIOLET: "#702D87",
	WHITE_GLASS: "rgba(255, 255, 255, 0.2)",
	BLACK: "#000000",
	HOME: "#9E9E9E",
	ANOTHER_PURPLE: "#9765A8",
};

type ColorsType = typeof Colors;

export default StyleSheet.create({
	...Object.fromEntries(
		Object.entries(Colors).map(([name, color]: [string, ColorValue]) => ["text" + name, { color }])
	),
	textPrimary: {
		color: Colors.primary,
	},
	textSecond: {
		color: Colors.second,
	},
	textWhite: {
		color: Colors.WHITE,
	},
	textGray: {
		color: Colors.GRAY,
	},
	textYellow: {
		color: Colors.YELLOW,
	},
	textTracing: {
		color: Colors.TRACING,
	},
	textTextBackground: {
		color: Colors.TEXT_BACKGROUND,
	},
	textDarkLetters: {
		color: Colors.DARK_LETTERS,
	},
	textGreen: {
		color: Colors.GREEN,
	},
	textOrange: {
		color: Colors.ORANGE,
	},
	textViolet: {
		color: Colors.VIOLET,
	},
	textWhiteGlass: {
		color: Colors.WHITE_GLASS,
	},
	textBlack: {
		color: Colors.BLACK,
	},
	textHome: {
		color: Colors.HOME,
	},
	textAnotherPurple: {
		color: Colors.ANOTHER_PURPLE,
	},
});
