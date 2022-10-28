/** @format */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, FlatList, ViewabilityConfig, ViewToken, ViewStyle } from "react-native";
import core from "~core";

interface Props {
	start: [number, number];
	end: [number, number];
	onChange?: (item: [number, number]) => void;
	style?: ViewStyle;
}

interface Ref {
	setTime: (newTime: number) => void;
}

const SelectTime = React.forwardRef<Ref, Props>((props, ref) => {
	const { start, end, onChange, style } = props;
	const [selectedIndexMinute, setSelectedIndexMinute] = React.useState(0);
	const [selectedIndexSecond, setSelectedIndexSecond] = React.useState(0);

	const minutes = React.useMemo(() => {
		const _minutes: Array<{ text: string | null; value: number }> = [
			{ text: null, value: -2 },
			{ text: null, value: -1 },
		];
		for (let i = start[0]; i <= end[0] + 2; i++) {
			_minutes.push({ text: i < 10 ? `0${i}` : i.toString(), value: i });
		}
		_minutes[_minutes.length - 2].text = null;
		_minutes[_minutes.length - 1].text = null;
		return _minutes;
	}, [start, end]);

	const seconds = React.useMemo(() => {
		const _seconds: Array<{ text: string | null; value: number }> = [
			{ text: null, value: -2 },
			{ text: null, value: -1 },
		];

		for (
			let i = selectedIndexMinute === 2 ? start[1] : 0;
			i <= (selectedIndexMinute === minutes.length - 2 ? end[1] : 61);
			i++
		) {
			_seconds.push({ text: i < 10 ? `0${i}` : i.toString(), value: i });
		}
		_seconds[_seconds.length - 2].text = null;
		_seconds[_seconds.length - 1].text = null;
		return _seconds;
	}, [start, end, selectedIndexMinute]);

	const _viewabilityConfig = React.useRef<ViewabilityConfig>({
		// viewAreaCoveragePercentThreshold: 100,
		itemVisiblePercentThreshold: 100,
		waitForInteraction: false,
	}).current;

	const _onViewableItemsChangedMinute = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			const mediumIndex = Math.floor(viewableItems.length / 2);
			if (viewableItems[mediumIndex].index !== null) {
				setSelectedIndexMinute(viewableItems[mediumIndex].index ?? 0);
			}
		}
	}).current;

	const _onViewableItemsChangedSecond = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			const mediumIndex = Math.floor(viewableItems.length / 2);

			if (viewableItems[mediumIndex].index !== null) {
				setSelectedIndexSecond(viewableItems[mediumIndex].index ?? 0);
			}
		}
	}).current;

	React.useEffect(() => {
		if (onChange) {
			const minute = minutes[selectedIndexMinute].text ?? "0";
			const second = seconds[selectedIndexSecond].text ?? "0";
			onChange([Number(minute), Number(second)]);
		}
	}, [selectedIndexMinute, selectedIndexSecond, minutes, seconds]);

	const minutesRef = React.useRef<FlatList>(null);
	const secondsRef = React.useRef<FlatList>(null);

	React.useImperativeHandle(ref, () => ({
		setTime: (newTime: number) => {
			const minuteIndex = minutes.findIndex(item => item.value === Math.floor(newTime / 60000));
			const secondIndex = seconds.findIndex(item => item.value === Math.fround((newTime % 60000) / 10000));
			if (minuteIndex !== -1 && secondIndex !== -1) {
				minutesRef.current?.scrollToIndex({ index: minuteIndex });
				secondsRef.current?.scrollToIndex({ index: secondIndex });
			}
		},
	}));

	return (
		<View style={[styles.container, style]}>
			<FlatList
				ref={minutesRef}
				key={"minutes"}
				data={minutes}
				renderItem={({ item, index }) => (
					<View>
						<Text
							style={[
								styles.numberGeneral,
								index === selectedIndexMinute
									? styles.numberSelected
									: Math.abs(index - selectedIndexMinute) === 1
									? styles.numberNoSelectedOne
									: styles.numberNoSelectedTwo,
							]}
						>
							{item.text}
						</Text>
					</View>
				)}
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChangedMinute}
				contentContainerStyle={{
					paddingVertical: Math.abs(styles.selected.bottom) - styles.numberGeneral.height * 0.5,
				}}
				style={[styles.selected, { left: 0 }]}
				keyExtractor={item => `minute_${item.value}`}
				decelerationRate={0.98}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				snapToInterval={styles.numberGeneral.height}
				// ListFooterComponent={<Text style={[styles.numberGeneral, { opacity: 1 }]}>-</Text>}
				// ListHeaderComponent={<Text style={[styles.numberGeneral, { opacity: 1 }]}>+</Text>}
			/>
			<LinearGradient
				style={styles.br}
				colors={[
					"rgba(235, 235, 235, 1)",
					"rgba(235, 235, 235, 0)",
					"rgba(235, 235, 235, 1)",
					"rgba(235, 235, 235, 0)",
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			/>
			<FlatList
				ref={secondsRef}
				key={"seconds"}
				data={seconds}
				renderItem={({ item, index }) => (
					<Text
						style={[
							styles.numberGeneral,
							index === selectedIndexSecond
								? styles.numberSelected
								: Math.abs(index - selectedIndexSecond) === 1
								? styles.numberNoSelectedOne
								: styles.numberNoSelectedTwo,
						]}
					>
						{item.text}
					</Text>
				)}
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChangedSecond}
				contentContainerStyle={{
					paddingVertical: Math.abs(styles.selected.bottom) - styles.numberGeneral.height * 0.5,
				}}
				style={[styles.selected, { right: 0 }]}
				keyExtractor={item => `second_${item.value}`}
				decelerationRate={0.98}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				snapToInterval={styles.numberGeneral.height}
			/>
		</View>
	);
});

SelectTime.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		height: "100%",
		justifyContent: "center",
		flexDirection: "row",
		width: 200,
		overflow: "hidden",
	},
	numberGeneral: {
		width: 54,
		height: 56,
		...core.gStyle.font("400"),
		textAlign: "center",
		textAlignVertical: "center",
	},
	numberSelected: {
		color: "#9765A8",
		fontSize: 48,
	},
	numberNoSelectedOne: {
		color: "#D3D3D3",
		fontSize: 40,
	},
	numberNoSelectedTwo: {
		color: "#F4F4F4",
		fontSize: 32,
	},
	br: {
		height: "100%",
		width: 4,
	},
	selected: {
		width: 60,
		top: -55,
		bottom: -55,
		position: "absolute",
		height: "auto",
	},
});

export default SelectTime;
