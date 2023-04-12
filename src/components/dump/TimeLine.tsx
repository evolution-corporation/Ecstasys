/** @format */

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";

import { ColorValue, StyleSheet, View, ViewProps } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { setColorOpacity } from "~core";

const TimeLine = forwardRef<Ref, TimeLineProps>((props, ref) => {
	const { color = "#FFFFFF", onChange, onStartChange, onEndChange, disable = false, initValue = 0 } = props;

	const [maxWidth, setMaxWidth] = useState<number | null>(null);
	let _value = initValue;
	const _colorBackground = setColorOpacity(color);
	const _colorBorderCircle = setColorOpacity(color, 0.5);
	const _frontLineWidth = useSharedValue(initValue ?? 0);
	const _scaleCircle = useSharedValue(1);
	const aStyles = {
		frontLine: useAnimatedStyle(() => ({
			width: _frontLineWidth.value,
		})),
		circle: useAnimatedStyle(() => ({
			transform: [{ scale: withTiming(_scaleCircle.value) }],
		})),
	};

	useImperativeHandle(ref, () => ({
		setValue: currentValue => {
			if (maxWidth) _frontLineWidth.value = withTiming(currentValue * maxWidth);
			_value = currentValue;
		},
	}));

	const returnUpdate = (width: number) => {
		if (maxWidth && onChange) {
			let percent = width / maxWidth;
			if (percent > 1) percent = 1;
			if (percent < 0) percent = 0;
			onChange(percent);
		}
	};

	const lineGestureTap = useMemo(
		() =>
			Gesture.Pan()
				.enabled(!disable)
				.onBegin(event => {
					_frontLineWidth.value = withTiming(event.x);
					if (maxWidth) _value = maxWidth / event.x;
					_scaleCircle.value = 1;

					if (onStartChange) runOnJS(onStartChange)();
				})
				.onUpdate(event => {
					if (maxWidth && event.x >= 0 && event.x <= maxWidth) {
						_frontLineWidth.value = event.x;
						_value = maxWidth / event.x;
						runOnJS(returnUpdate)(event.x);
					}
				})
				.onFinalize(event => {
					if (maxWidth && onChange) {
						runOnJS(returnUpdate)(event.x);
					}
					_scaleCircle.value = 1;
					if (onEndChange) runOnJS(onEndChange)();
				}),
		[maxWidth]
	);

	useEffect(() => {
		if (maxWidth !== null) _frontLineWidth.value = maxWidth * _value;
	}, [maxWidth]);

	return (
		<GestureDetector gesture={lineGestureTap}>
			<View style={styles.background}>
				<View
					style={[styles.line, styles.backLine, { backgroundColor: _colorBackground }]}
					onLayout={({ nativeEvent: { layout } }) => {
						setMaxWidth(layout.width);
					}}
				/>

				<Animated.View style={[styles.line, styles.frontLine, aStyles.frontLine, { backgroundColor: color }]}>
					<Animated.View
						style={[
							aStyles.circle,
							styles.circle,
							{
								backgroundColor: color,
								borderColor: _colorBorderCircle,
							},
						]}
					/>
				</Animated.View>
			</View>
		</GestureDetector>
	);
});

interface Ref {
	setValue: (percent: number) => void;
}

interface TimeLineProps extends ViewProps {
	color?: ColorValue;
	onChange?: (percent: number) => void;
	onStartChange?: () => void;
	onEndChange?: () => void;
	disable?: boolean;
	initValue?: number;
}

export default TimeLine;

const styles = StyleSheet.create({
	background: {
		height: 40,
		justifyContent: "center",
		width: "100%",
	},
	line: {
		height: 4,
		borderRadius: 3,
		position: "absolute",
	},
	backLine: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	frontLine: {
		zIndex: 0,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	circle: {
		width: 18,
		height: 18,
		borderRadius: 14,
		borderWidth: 2,
		position: "absolute",
		right: -14,
	},
});
