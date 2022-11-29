import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextDescriptionProperties extends TextProps {
	color?: ColorName;
	numberOfLinesTwo?: boolean;
}

const TextDescription: React.FC<TextDescriptionProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "Description",
				color: properties.color ?? "BLACK",
			}),
		]}
		numberOfLines={properties.numberOfLinesTwo ? 2 : undefined}
	/>
);

TextDescription.defaultProps = {};

export default TextDescription;
