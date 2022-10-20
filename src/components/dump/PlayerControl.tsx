/** @format */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ViewProps, Dimensions } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ArrowRight from "assets/icons/ControlButton_Right.svg";
import ArrowLeft from "assets/icons/ControlButton_Left.svg";
import PauseIcon from "assets/icons/ControlButton_Pause.svg";
import PlayIcon from "assets/icons/ControlButton_Play.svg";
import core from "~core";
import { useDimensions } from "@react-native-community/hooks";

interface Props extends ViewProps {
	pause: () => Promise<void>;
	play: () => Promise<void>;
	stepForward: () => Promise<void>;
	stepBack: () => Promise<void>;
	isPlay: boolean;
}

const PlayerControl: React.FC<Props> = props => {
	const { pause, play, stepBack, stepForward, isPlay, style } = props;
	const {
		window: { width },
	} = useDimensions();
	const rightValueTranslateX = useSharedValue(isPlay ? 0 : width);
	const leftValueTranslateX = useSharedValue(isPlay ? 0 : -width);

	useEffect(() => {
		if (isPlay) {
			rightValueTranslateX.value = 0;
			leftValueTranslateX.value = 0;
		} else {
			rightValueTranslateX.value = width;
			leftValueTranslateX.value = -width;
		}
	}, [isPlay]);

	const leftButtonStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: withTiming(leftValueTranslateX.value) }],
	}));

	const rightButtonStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: withTiming(rightValueTranslateX.value) }],
	}));

	return (
		<View {...props} style={[styles.background, style]}>
			{stepBack !== undefined && (
				<Animated.View style={leftButtonStyle}>
					<Pressable style={[styles.buttonControl, styles.buttonSmall]} onPress={() => stepBack()}>
						<ArrowLeft style={styles.arrowControl} />
						<Text style={styles.textJumpTime}>15</Text>
					</Pressable>
				</Animated.View>
			)}
			<Pressable
				onPress={!isPlay ? () => play() : () => pause()}
				style={[styles.buttonControl, styles.centerButtonControl]}
			>
				{!isPlay ? <PlayIcon /> : <PauseIcon />}
			</Pressable>
			{stepForward !== undefined && (
				<Animated.View style={rightButtonStyle}>
					<Pressable style={[styles.buttonControl, styles.buttonSmall]} onPress={() => stepForward()}>
						<ArrowRight style={styles.arrowControl} />
						<Text style={styles.textJumpTime}>15</Text>
					</Pressable>
				</Animated.View>
			)}
		</View>
	);
};

PlayerControl.defaultProps = {};

export default PlayerControl;

const styles = StyleSheet.create({
	background: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	buttonControl: {
		backgroundColor: "rgba(61, 61, 61, 0.5)",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 11.5,
	},
	centerButtonControl: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	buttonSmall: {
		width: 41,
		height: 41,
		borderRadius: 20.5,
		justifyContent: "flex-end",
		padding: 8,
	},
	arrowControl: {
		position: "absolute",
		top: 7,
	},
	panelControl: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	textJumpTime: {
		color: "#FFFFFF",
		fontSize: 13,
		...core.gStyle.font("400"),
	},
});
