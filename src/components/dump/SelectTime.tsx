/** @format */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, FlatList, ViewabilityConfig, ViewToken, ViewStyle, Platform } from "react-native";
import core from "~core";

interface Properties {
	start: [number, number];
	end: [number, number];
	onChange?: (item: [number, number]) => void;
	style?: ViewStyle;
}

interface Reference {
	setTime: (newTime: number) => void;
}

const SelectTime = React.forwardRef<Reference, Properties>((props, ref) => {
	const { start, end, onChange, style } = props;
	const [selectedIndexMinute, setSelectedIndexMinute] = React.useState(0);
	const [selectedIndexSecond, setSelectedIndexSecond] = React.useState(0);

	const minutes = React.useMemo(() => {
		const _minutes: Array<{ text: string | null; value: number }> = [];
		for (let i = start[0]; i <= end[0]; i++) {
			_minutes.push({ text: i < 10 ? `0${i}` : i.toString(), value: i });
		}
		return _minutes;
	}, [start, end]);

	const seconds = React.useMemo(() => {
		const _seconds: Array<{ text: string | null; value: number }> = [];

		for (
			let i = selectedIndexMinute === 0 ? start[1] : 0;
			i <= (selectedIndexMinute === minutes.length - 1 ? end[1] : 59);
			i++
		) {
			_seconds.push({ text: i < 10 ? `0${i}` : i.toString(), value: i });
		}
		return _seconds;
	}, [start, end, selectedIndexMinute]);

	const _viewabilityConfig = React.useRef<ViewabilityConfig>({
		viewAreaCoveragePercentThreshold: 100,
		minimumViewTime: 10,
		waitForInteraction: false,
	}).current;

	const _onViewableItemsChangedMinute = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length === 2) {
			if (viewableItems[0]?.index !== null) {
				if (viewableItems[0].index === 0) {
					setSelectedIndexMinute(0);
				} else {
					setSelectedIndexSecond(0);
					setSelectedIndexMinute(minutes.length - 1);
				}
			}
		} else if (viewableItems.length > 0) {
			const mediumIndex = viewableItems[Math.floor(viewableItems.length / 2)]?.index;
			if (mediumIndex !== null) {
				setSelectedIndexMinute(mediumIndex ?? 0);
			}
		}
	}).current;

	const _onViewableItemsChangedSecond = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length === 2) {
			if (viewableItems[0]?.index !== null) {
				if (viewableItems[0].index === 0) {
					setSelectedIndexSecond(0);
				} else {
					setSelectedIndexSecond(seconds.length - 1);
				}
			}
		} else if (viewableItems.length > 0) {
			const mediumIndex = viewableItems[Math.floor(viewableItems.length / 2)]?.index;
			if (mediumIndex !== null) {
				setSelectedIndexSecond(mediumIndex ?? 0);
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
			const secondIndex = seconds.findIndex(item => item.value === Math.floor((newTime % 60000) / 1000));
			if (minuteIndex !== -1 || secondIndex !== -1) {
				minutesRef.current?.scrollToIndex({ index: minuteIndex, viewOffset: 56 });
				secondsRef.current?.scrollToIndex({ index: seconds.length < 59 ? secondIndex : 0, viewOffset: 56 })

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
								index === selectedIndexMinute ? styles.numberSelected : styles.numberNoSelectedOne,
							]}
						>
							{item.text}
						</Text>
					</View>
				)}
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChangedMinute}
				contentContainerStyle={{
					paddingTop: styles.numberGeneral.height,
					paddingBottom: styles.numberGeneral.height + 10,
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
				colors={["rgba(235, 235, 235, 0)", "rgba(235, 235, 235, 1)", "rgba(235, 235, 235, 0)"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
			/>
			<FlatList
				ref={secondsRef}
				key={"seconds"}
				data={seconds}
				renderItem={({ item, index }) => (
					<Text
						style={[
							styles.numberGeneral,
							index === selectedIndexSecond ? styles.numberSelected : styles.numberNoSelectedOne,
						]}
						adjustsFontSizeToFit
					>
						{item.text}
					</Text>
				)}
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChangedSecond}
				contentContainerStyle={{
					paddingTop: styles.numberGeneral.height,
					paddingBottom: styles.numberGeneral.height + 10,
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
		maxHeight: 190,
		justifyContent: "center",
		flexDirection: "row",
		width: 200,
		// overflow: "hidden",
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
		fontSize: Platform.OS === "ios" ? 42 : 48,
	},
	numberNoSelectedOne: {
		color: "#D3D3D3",
		fontSize: Platform.OS === "ios" ? 42 : 48,
	},
	numberNoSelectedTwo: {
		color: "#F4F4F4",
		fontSize: Platform.OS === "ios" ? 36 : 40,
	},
	br: {
		height: "100%",
		width: 2,
	},
	selected: {
		width: 60,
		top: -0,
		bottom: -0,
		position: "absolute",
		height: 180,
	},
});

export default SelectTime;
