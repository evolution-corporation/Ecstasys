/** @format */

import React from "react";
import { ColorValue } from "react-native";
import { CustomPartTextProperty } from "./custom-part-text";

export type TextValue = string | React.ReactElement<CustomPartTextProperty>;

interface TextProperty {
	color?: ColorValue;
	children: string | TextValue[];
}

export default TextProperty;
