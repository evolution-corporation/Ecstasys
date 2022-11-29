import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextHeaderProperties extends TextProps {
	color?: ColorName;
}

const TextHeader: React.FC<TextHeaderProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "Header",
				color: properties.color ?? "BLACK",
			}),
		]}
		adjustsFontSizeToFit
	/>
);

TextHeader.defaultProps = {};

export default TextHeader;
