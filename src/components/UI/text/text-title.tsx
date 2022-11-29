import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextTitleProperties extends TextProps {
	color?: ColorName;
}

const TextTitle: React.FC<TextTitleProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "Title",
				color: properties.color ?? "BLACK",
			}),
		]}
	/>
);

TextTitle.defaultProps = {};

export default TextTitle;
