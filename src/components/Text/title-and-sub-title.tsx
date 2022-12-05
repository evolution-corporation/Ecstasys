/** @format */

import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

import gStyle from "~styles";
import TextProperty from "./text-property";

export interface TitleAndSubTitleProperty extends TextProperty {
	title: string;
	subtitle: string;
	styleTitle?: StyleProp<TextStyle>;
	styleSubTitle?: StyleProp<TextStyle>;
	style?: StyleProp<Omit<ViewStyle, "justifyContent" | "flexDirection">>;
}

const TitleAndSubTitle: React.FC<TitleAndSubTitleProperty> = properties => {
	const {
		subtitle,
		title,
		styleSubTitle = gStyle.styles.subTitle,
		styleTitle = gStyle.styles.title,
		style,
	} = properties;

	return (
		<View style={style}>
			<Text style={styleTitle} key={"title"}>
				{title}
			</Text>
			<Text style={styleSubTitle} key={"subTitle"}>
				{subtitle}
			</Text>
		</View>
	);
};

export default TitleAndSubTitle;
