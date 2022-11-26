/** @format */

import React from "react";
import { Text, TextProps } from "react-native";

export default function (WrapperText: typeof Text, maxWidth: number) {
	return (props: TextProps & { setIsReady: () => void }) => {
		const [isLoading, setIsLoading] = React.useState(true);
		const textRef = React.useRef<Text>(null);
		const [fontSize, setFontSize] = React.useState(1);

		return (
			<WrapperText
				{...props}
				ref={textRef}
				onTextLayout={({ nativeEvent: { lines } }) => {
					if (isLoading) {
						if (lines[0].width < maxWidth && lines.length === 1) {
							setFontSize(prevFontSize => prevFontSize + 1);
						} else {
							setFontSize(prevFontSize => prevFontSize - 1);
							setIsLoading(false);
						}
					}
				}}
				style={{ fontSize, zIndex: isLoading ? -1 : 1 }}
			/>
		);
	};
}
