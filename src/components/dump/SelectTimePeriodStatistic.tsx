/** @format */

import React from "react";
import RN, { StyleSheet } from "react-native";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Arrow from "assets/icons/Chevron_Down.svg";
import Tools from "~core";
import i18n from "~i18n";

import { StatisticPeriod } from "~types";
import core from "~core";

interface Props extends RN.ViewProps {
	onChangePeriod?: (period: StatisticPeriod) => void;
}

const SelectTimePeriodStatistic: React.FC<Props> = props => {
	const { onChangePeriod } = props;
	//* animation
	const containerWidth = React.useRef<number | null>(null);
	const coordinateWordCenter = React.useRef<{ [key in StatisticPeriod]?: number }>({});
	const getTransparentPositionArrowByCenterWords = (timePeriod: StatisticPeriod) => {
		if (containerWidth.current !== null && coordinateWordCenter.current[timePeriod] !== undefined) {
			return (coordinateWordCenter.current[timePeriod] ?? 0) - containerWidth.current / 2;
		} else {
			return 0;
		}
	};
	const animationValue: { [key in StatisticPeriod]: SharedValue<number> } = {
		WEEK: useSharedValue(0.6),
		MONTH: useSharedValue(1),
		ALL: useSharedValue(0.6),
	};
	const animationStyle: {
		[key in StatisticPeriod]: {
			opacity: number;
			fontSize: number;
		};
	} = {
		WEEK: useAnimatedStyle(() => ({
			opacity: withTiming(animationValue.WEEK.value),
			fontSize: interpolate(animationValue.WEEK.value, [0.6, 1], [12, 14]),
		})),
		MONTH: useAnimatedStyle(() => ({
			opacity: withTiming(animationValue.MONTH.value),
			fontSize: interpolate(animationValue.MONTH.value, [0.6, 1], [12, 14]),
		})),
		ALL: useAnimatedStyle(() => ({
			opacity: withTiming(animationValue.ALL.value),
			fontSize: interpolate(animationValue.ALL.value, [0.6, 1], [12, 14]),
		})),
	};
	const positionArrow = useSharedValue(0);

	const positionArrowStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: withTiming(positionArrow.value) }, { scale: 2 }],
	}));

	// ---

	const editStatisticPeriod = React.useCallback((period: StatisticPeriod) => {
		for (let name of Object.keys(animationValue) as StatisticPeriod[]) {
			animationValue[name].value = name === period ? 1 : 0.6;
		}
		if (onChangePeriod) onChangePeriod(period);
		positionArrow.value = getTransparentPositionArrowByCenterWords(period);
	}, []);
	return (
		<RN.View
			{...props}
			onLayout={({ nativeEvent: { layout } }) => {
				containerWidth.current = layout.width;
			}}
		>
			<RN.View style={[styles.selectTimePeriodContainer, { borderColor: "blue", borderWidth: 2 }]}>
				{[
					{ index: StatisticPeriod.WEEK, text: i18n.t("9e9fa745-7048-4a16-b227-7e3393a0e760") },
					{ index: StatisticPeriod.MONTH, text: i18n.t("39f791d7-75c7-4c2a-9ea2-cbdd0d4fac17") },
					{ index: StatisticPeriod.ALL, text: i18n.t("3bbe4d69-a6c5-4da0-8dad-0a67fd10cc61") },
				].map(({ index, text }) => (
					<RN.Pressable
						key={index}
						style={{ borderColor: "blue", borderWidth: 2 }}
						hitSlop={20}
						onPress={() => editStatisticPeriod(index)}
						onLayout={({ nativeEvent: { layout } }) => {
							coordinateWordCenter.current[index] = layout.x + layout.width / 2;
						}}
					>
						<Animated.Text style={[styles.namePeriod, animationStyle[index]]}>{text}</Animated.Text>
					</RN.Pressable>
				))}
			</RN.View>
			<Animated.View style={[{ alignSelf: "center" }, positionArrowStyle]}>
				<Arrow />
			</Animated.View>
		</RN.View>
	);
};

SelectTimePeriodStatistic.defaultProps = {};

const styles = StyleSheet.create({
	selectTimePeriodContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},

	buttonText: {
		color: "#FFFFFF",
		fontSize: 14,
		...Tools.gStyle.font("500"),
	},
	namePeriod: {
		fontSize: 14,
		color: "#FFFFFF",
		...core.gStyle.font("500"),
	},
});

export default SelectTimePeriodStatistic;
