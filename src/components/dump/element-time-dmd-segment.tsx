/** @format */

import React from "react";
import { View, Text, StyleSheet, ColorValue, Pressable } from "react-native";
import DateTime from "src/global/class/date-time";
import ViewFullWidth, { Direction, PositionElements } from "~components/layouts/view-full-width";
import ViewPadding from "~components/layouts/view-padding";
import DefaultText from "~components/Text/default-text";
import ArrowDown from "assets/icons/Chevron_Down.svg";
import i18n from "~i18n";
import ViewPaddingList, { Direction as DirectionAxis } from "~components/containers/view-padding-list";

interface ElementTimeDMDSegmentProperties {
	index: number;
	name: string;
	time: DateTime;
	onPress?: () => void;
	color: ColorValue;
}

const ElementTimeDMDSegment: React.FC<ElementTimeDMDSegmentProperties> = properties => {
	const { color, index, name, time, onPress } = properties;
	const paddingsRightElements = [0];
	if (!!onPress) {
		paddingsRightElements.push(6);
	}
	paddingsRightElements.push(19);
	const content = (
		<ViewFullWidth
			direction={Direction.LeftRight}
			style={{ height: 40, backgroundColor: color, alignItems: "center", borderRadius: 10 }}
			mainPositionElements={PositionElements.StartEnd}
		>
			<ViewPadding left={9}>
				<DefaultText color={"#FFF"}>
					{index.toString()}. {name}
				</DefaultText>
			</ViewPadding>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<ViewPaddingList paddings={paddingsRightElements} direction={DirectionAxis.Horizontal}>
					<DefaultText color={"#FFF"}>{i18n.strftime(time, "%M:%S")}</DefaultText>
					{onPress ? <ArrowDown /> : <></>}
				</ViewPaddingList>
			</View>
		</ViewFullWidth>
	);
	if (onPress) {
		return <Pressable onPress={() => onPress()}>{content}</Pressable>;
	}
	return <View>{content}</View>;
};

ElementTimeDMDSegment.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default ElementTimeDMDSegment;
