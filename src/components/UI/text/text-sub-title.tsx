import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextSubTitleProperties extends TextProps {
	color?: ColorName;
}

const TextSubTitle: React.FC<TextSubTitleProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "SubTitle",
				color: properties.color ?? "BLACK",
			}),
		]}
	/>
);

TextSubTitle.defaultProps = {};

export default TextSubTitle;
