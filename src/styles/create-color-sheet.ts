/** @format */

import { ColorValue } from "react-native";
import { toPascalCase } from "src/edit-case";
import Colors from "config/colors.json";

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
	return Object.fromEntries(colorStylesAtArray);
};
