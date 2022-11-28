/** @format */

import { ColorValue, StyleSheet } from "react-native";
import { toPascalCase } from "src/edit-case";
import Colors from "config/colors.json";

// export function setColorOpacity(color: ColorValue, opacity: number = 0.5) {
// 	let r: number | undefined = undefined;
// 	let g: number | undefined = undefined;
// 	let b: number | undefined = undefined;
// 	let o: number = opacity;
// 	const color_str = color.toString();
// 	if (color_str.indexOf("#") !== -1) {
// 		const bigint = parseInt(color_str.split("#")[1], 16);
// 		r = (bigint >> 16) & 255;
// 		g = (bigint >> 8) & 255;
// 		b = bigint & 255;
// 	} else if (color_str.indexOf("rgb") !== -1) {
// 		const rgb = color_str.replace(/rgba?/, "").replace("(", "").replace(")", "").split(",");
// 		if (rgb && rgb.length >= 3) {
// 			r = parseInt(rgb[0], 10);
// 			g = parseInt(rgb[1], 10);
// 			b = parseInt(rgb[2], 10);
// 			if (rgb.length === 4) {
// 				o = Number(rgb[3]) * o;
// 			}
// 		}
// 	}
// 	if (typeof r === "undefined") r = 0;
// 	if (typeof g === "undefined") g = 0;
// 	if (typeof b === "undefined") b = 0;
// 	return `rgba(${r}, ${g}, ${b}, ${o})`;
// }

export default () => {
	let colorStylesAtArray: [string, object][] = [];
	for (const option of [
		["text", "color"],
		["background", "backgroundColor"],
	]) {
		const [nameElement, nameField] = option;
		colorStylesAtArray = [
			...colorStylesAtArray,
			...Object.entries(Colors).map<[string, object]>(([name, color]: [string, ColorValue]) => [
				nameElement + toPascalCase(name),
				Object.fromEntries([[nameField, color]]),
			]),
		];
	}
	return StyleSheet.create(Object.fromEntries(colorStylesAtArray));
};
