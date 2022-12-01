/** @format */

import React from "react";
import { ColorValue, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export interface SelectColorProps {
	size: number;
	widthBorder: number;
	onChange?: (color: ColorValue) => void;
	initColor?: ColorValue;
}

type NumberColor = { r: number; g: number; b: number };

const colorGrade: NumberColor[] = [
	{ r: 134, g: 201, b: 39 }, // rgba(134, 201, 39, 1)
	{ r: 243, g: 224, b: 3 }, // rgba(243, 224, 3, 1)
	{ r: 255, g: 182, b: 0 }, // rgba(255, 182, 0, 1)
	{ r: 254, g: 67, b: 46 }, // rgba(254, 67, 46, 1)
	{ r: 147, g: 61, b: 211 }, // rgba(147, 61, 211, 1)
	{ r: 74, g: 73, b: 255 }, // rgba(74, 73, 255, 1)
	{ r: 15, g: 133, b: 255 }, // rgba(15, 133, 255, 1)
	{ r: 54, g: 205, b: 237 }, // rgba(54, 205, 237, 1),
];

function __getColor(start: number, end: number, x: number) {
	return (end - start) * x + start;
}

const _getFunction = (start: number, end: number, length: number, k: number = 0.9013878189): NumberColor => {
	return {
		r: __getColor(colorGrade[start].r, colorGrade[end].r, length * k),
		g: __getColor(colorGrade[start].g, colorGrade[end].g, length * k),
		b: __getColor(colorGrade[start].b, colorGrade[end].b, length * k),
	};
};

async function getColor(grade: number): Promise<ColorValue> {
	let color: NumberColor = { r: 255, g: 255, b: 255 };
	if (grade === -90) {
		color = colorGrade[0];
	} else if (grade === -45) {
		color = colorGrade[1];
	} else if (grade === 0) {
		color = colorGrade[2];
	} else if (grade === 45) {
		color = colorGrade[3];
	} else if (grade === 90) {
		color = colorGrade[4];
	} else if (grade === 135) {
		color = colorGrade[5];
	} else if (grade === 180) {
		color = colorGrade[6];
	} else if (grade === 225) {
		color = colorGrade[7];
	}

	const gradePart = Math.abs((grade % 45) / 45);
	if (grade > -90 && grade < -45) {
		color = _getFunction(1, 0, gradePart);
	} else if (grade > -45 && grade < 0) {
		color = _getFunction(2, 1, gradePart);
	} else if (grade > 0 && grade < 45) {
		color = _getFunction(2, 3, gradePart);
	} else if (grade > 45 && grade < 90) {
		color = _getFunction(3, 4, gradePart);
	} else if (grade > 90 && grade < 135) {
		color = _getFunction(4, 5, gradePart);
	} else if (grade > 135 && grade < 180) {
		color = _getFunction(5, 6, gradePart);
	} else if (grade > 180 && grade < 225) {
		color = _getFunction(6, 7, gradePart);
	} else if (grade > 225 && grade < 271) {
		color = _getFunction(7, 0, gradePart, 0.5590169944);
	}
	return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

const SelectColor: React.FC<SelectColorProps> = props => {
	const { size, widthBorder, onChange, initColor = "rgb(134, 201, 39)" } = props;
	const sizeSelecor = size - widthBorder;

	const [color, setColor] = React.useState<ColorValue>("rgb(134, 201, 39)");
	React.useEffect(() => {
		setColor(initColor);
	}, []);
	const returnColor = (grade: number) => {
		getColor(grade).then(setColor);
	};

	const [brightness, setBrightness] = React.useState<number>(0.5);

	const colorCircule = React.useMemo(() => {
		const [r, g, b] = color
			.toString()
			.slice(4, color.toString().length - 1)
			.replaceAll(" ", "")
			.split(",")
			.map(colorS => Number(colorS));

		const secondValue = brightness < 0 ? 0 : 255;
		const colorInt = {
			r: __getColor(r, secondValue, Math.abs(brightness)),
			g: __getColor(g, secondValue, Math.abs(brightness)),
			b: __getColor(b, secondValue, Math.abs(brightness)),
		};
		return `rgb(${colorInt.r}, ${colorInt.g}, ${colorInt.b})`;
	}, [brightness, color]);

	React.useEffect(() => {
		if (onChange) onChange(colorCircule);
	}, [colorCircule]);

	const circuleGestore = Gesture.Pan().onFinalize(({ x, y }) => {
		const [selectX, selectY] = [x - size / 2, size / 2 - y];
		const [selectPartX, selectPartY] = [selectX / sizeSelecor, selectY / sizeSelecor];
		if (Math.sqrt(Math.pow(selectPartX, 2) + Math.pow(selectPartY, 2)) >= 0.4) {
			const grade = Math.atan(selectPartX / selectPartY) / (Math.PI / 180) + (selectPartY < 0 ? 180 : 0);
			runOnJS(returnColor)(grade);
		}
	});

	const lineGesture = Gesture.Pan().onFinalize(({ x }) => {
		runOnJS(setBrightness)((2 * x) / size - 1);
	});

	const numberIndex: number[] = [];
	for (let i = 1; i <= 8; i++) {
		numberIndex.push(i);
	}

	const [dots, lengthSlice] = React.useMemo<[string[], number]>(() => {
		const _dots: string[] = [];
		for (let grade = -90; grade <= 271; grade += 1) {
			const rad = grade * (Math.PI / 180);
			const x = (Math.cos(rad) * sizeSelecor) / 2;
			const y = (Math.sin(rad) * sizeSelecor) / 2;
			_dots.push(`${x} ${y}`);
		}
		return [_dots, Math.floor(_dots.length / numberIndex.length)];
	}, [sizeSelecor]);

	return (
		<>
			<GestureDetector gesture={circuleGestore}>
				<Svg width={size} height={size}>
					<G y={size / 2} x={size / 2}>
						{numberIndex.map((index, prevIndex) => (
							<Path
								d={`M${dots
									.map(item => `${item}`)
									.slice(prevIndex * lengthSlice, index * lengthSlice + 2)
									.join(" ")}`}
								stroke={`url(#CirculeColor_${index})`}
								strokeWidth={widthBorder}
								key={"index" + index}
							/>
						))}
					</G>
					<Circle r={30} fill={colorCircule} cx={size / 2} cy={size / 2} />
					<Defs>
						<LinearGradient id="CirculeColor_1" x1={0} y1={0.25} x2={0.75} y2={0.75}>
							<Stop offset="0" stopColor="#ffb600" stopOpacity="1" />
							<Stop offset="1" stopColor="#fe432e" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_2" x1={0.25} y1={0.25} x2={0.75} y2={1}>
							<Stop offset="0" stopColor="#fe432e" stopOpacity="1" />
							<Stop offset="1" stopColor="#933dd3" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_3" x1={0.75} y1={0} x2={0.25} y2={0.75}>
							<Stop offset="0" stopColor="#933dd3" stopOpacity="1" />
							<Stop offset="1" stopColor="#4a49ff" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_4" x1={0.75} y1={0.25} x2={0} y2={0.75}>
							<Stop offset="0" stopColor="#4a49ff" stopOpacity="1" />
							<Stop offset="1" stopColor="#0f85ff" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_5" x1={1} y1={0.75} x2={0.25} y2={0.25}>
							<Stop offset="0" stopColor="#0f85ff" stopOpacity="1" />
							<Stop offset="1" stopColor="#36cded" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_6" x1={0.75} y1={0.75} x2={0.25} y2={0}>
							<Stop offset="0" stopColor="#36cded" stopOpacity="1" />
							<Stop offset="1" stopColor="#86c927" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_7" x1={0.25} y1={1} x2={0.75} y2={0.25}>
							<Stop offset="0" stopColor="#86c927" stopOpacity="1" />
							<Stop offset="1" stopColor="#f3e003" stopOpacity="1" />
						</LinearGradient>
						<LinearGradient id="CirculeColor_8" x1={0.75} y1={0.75} x2={1} y2={0.25}>
							<Stop offset="0" stopColor="#f3e003" stopOpacity="1" />
							<Stop offset="1" stopColor="#ffb600" stopOpacity="1" />
						</LinearGradient>
					</Defs>
				</Svg>
			</GestureDetector>
			<View style={{ top: 26 }}>
				<GestureDetector gesture={lineGesture}>
					<Svg width={size} height={30}>
						<Rect width={size} height={30} fill={"url(#Line)"} />
						<Defs>
							<LinearGradient id={"Line"}>
								<Stop offset="0" stopColor="#000" stopOpacity="1" />
								<Stop offset="0.5" stopColor={color} stopOpacity="1" />
								<Stop offset="1" stopColor="#fff" stopOpacity="1" />
							</LinearGradient>
						</Defs>
					</Svg>
				</GestureDetector>
			</View>
		</>
	);
};

export default React.memo(SelectColor);
