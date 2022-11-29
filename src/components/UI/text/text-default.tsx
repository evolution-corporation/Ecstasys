import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextDefaultProperties extends TextProps {
	color?: ColorName;
}

const TextDefault: React.FC<TextDefaultProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "NamePractice",
				color: properties.color ?? "BLACK",
			}),
		]}
		adjustsFontSizeToFit
	/>
);

TextDefault.defaultProps = {};

export default TextDefault;
