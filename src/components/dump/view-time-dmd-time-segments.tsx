/** @format */

import { useNavigation } from "@react-navigation/native";
import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Rect, Svg } from "react-native-svg";
import DateTime from "src/global/class/date-time";
import useSizeElement from "src/hooks/use-size-element";
import useTimeNotificationDMD, { TimeSegments } from "src/hooks/use-time-notification-dmd";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import i18n from "~i18n";
import ElementTimeDMDSegment from "./element-time-dmd-segment";
import useNotificationStatus from "../../hooks/use-notification-status";

export interface ViewTimeDMDTimeSegmentsProperties {
	onPress?: (timeSegment: TimeSegments) => void;
}

const ViewTimeDMDTimeSegments: React.FC<ViewTimeDMDTimeSegmentsProperties> = properties => {
	const navigation = useNavigation();
	const [timeSegments] = useTimeNotificationDMD();
	const [elementSize, changeElementSize] = useSizeElement();
	const [statusNotification, updateStatusNotification] = useNotificationStatus()
	let indexElementTimeDMDSegment = 1;
	const getIndexElementTimeDMDSegment = () => indexElementTimeDMDSegment++;
	const color = statusNotification  ? "#9765A8" : "#E2E2E2"
	const onPress = (function_: () => void) => statusNotification ? function_() : updateStatusNotification()

	return (
		<View onLayout={({ nativeEvent: { layout } }) => changeElementSize(layout)}>
			<Svg style={{ alignSelf: "center", position: "absolute" }} width={4} height={elementSize?.height}>
				<Rect width={0} height={elementSize?.height} strokeWidth={4} stroke={color} />
			</Svg>
			<ViewPaddingList direction={Direction.Vertical} paddings={10}>
				<ElementTimeDMDSegment
					index={getIndexElementTimeDMDSegment()}
					color="#C2A9CE"
					name={i18n.t("489177eb-1aa7-4fb7-9963-8abfe4cbf63e")}
					time={new DateTime(timeSegments.setup)}
					key={"Setup"}
				/>
				<ElementTimeDMDSegment
					index={getIndexElementTimeDMDSegment()}
					color={color}
					name={i18n.t("a3278599-1f56-437e-9dec-878f88e33abe")}
					time={new DateTime(timeSegments.activeBreathing)}
					onPress={() => onPress(() => navigation.navigate("DMDSelectTimeBright", { type: "activate" }))}
					key={"activeBreathing"}
				/>
				<ElementTimeDMDSegment
					index={getIndexElementTimeDMDSegment()}
					color={color}
					name={i18n.t("d08f1ccf-6c67-41bc-afff-f65373c7b00c")}
					time={new DateTime(timeSegments.spontaneousBreathing)}
					onPress={() => onPress(() => navigation.navigate("DMDSelectTimeBright", { type: "random" }))}
					key={"spontaneousBreathing"}
				/>
				<ElementTimeDMDSegment
					index={getIndexElementTimeDMDSegment()}
					color={statusNotification ? "#C2A9CE" : "#E2E2E2"}
					name={i18n.t("5031cd30-0010-42e1-8d47-7516d63e2a6a")}
					time={new DateTime(timeSegments.freeBreathing)}
					key={"freeBreathing"}
				/>
			</ViewPaddingList>
		</View>
	);
};

ViewTimeDMDTimeSegments.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default ViewTimeDMDTimeSegments;
