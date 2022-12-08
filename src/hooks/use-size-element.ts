/** @format */

import React from "react";
import { LayoutRectangle } from "react-native";

export interface ElementSize {
	width: number;
	height: number;
}

const useSizeElement = (): [ElementSize | undefined, (layout: LayoutRectangle) => void] => {
	const [size, setSize] = React.useState<ElementSize>();

	const getSize = (layout: LayoutRectangle) => {
		setSize({ width: layout.width, height: layout.height });
	};

	return [size, getSize];
};

export default useSizeElement;
