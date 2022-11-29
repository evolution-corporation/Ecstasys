import Colors from "config/colors.json";
import Fonts from "config/fonts.json";
import { getNameStyleForText } from "./create-color-sheet";

export interface ParametersMixingFontStyle {
	color?: keyof typeof Colors;
	font?: keyof typeof Fonts;
}

export default (parameters: ParametersMixingFontStyle) => {
	const { color = "BLACK", font = "Text" } = parameters;
	if (String.prototype.toPascalCase === undefined) {
		throw new Error("Строка должна содержать метод toPascalCase");
	}
	return {
		...GlobalStyleSheet[font],
		...GlobalStyleSheet[getNameStyleForText(color)],
	};
};
