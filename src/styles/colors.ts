/** @format */

import { ColorValue } from "react-native";

export default {
	StrokePanel: "#C2A9CE",
	TextOnTheBackground: "#E7DDEC",
	White: "#FFFFFF",
	DarkLetters: "#555555",
	black: "#000000",
	WhiteGlass: "rgba(255, 255, 255, 0.2)",
	WhiteBrightGlass: "rgba(255, 255, 255, 0.8)",
	gray: "#3D3D3D",
	DarkGlass: "rgba(0, 0,0 ,0.2)",
	orange: "#FF5C00",
	grayGlass: "rgba(240, 242, 238, 0.19)",
	violet: "#702D87",
	noName1: "#A0A0A0",
	skin: "#FEEBED",
	perano: "#A7A9E0",
	carbon: "#3D3D3D",
	moreViolet: "#9765A8",
	moreGray: "rgba(64, 64, 64, 0.71)",
};

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
