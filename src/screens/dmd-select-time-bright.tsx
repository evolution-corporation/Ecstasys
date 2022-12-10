/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import useTimeNotificationDMD, { TimeSegments } from "src/hooks/use-time-notification-dmd";
import ScreenModal, { PositionContentBlock } from "~components/containers/screen-modal";
import { ColorButton, SelectTime } from "~components/dump";
import i18n from "~i18n";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { RootScreenProps } from "~types";

const DMDSelectTimeBright: RootScreenProps<"DMDSelectTimeBright"> = ({ navigation, route }) => {
	const { type } = route.params;
	const { window } = useDimensions();
	const isActive = type === "activate";

	const [timeSegments, setTimeNotification] = useTimeNotificationDMD();

	const value = isActive ? timeSegments.activeBreathing : timeSegments.spontaneousBreathing;
	const selectTime = React.useRef<number>(value);

	const saveTime = () => {
		setTimeNotification(
			isActive ? TimeSegments.ActiveBreathing : TimeSegments.SpontaneousBreathing,
			selectTime.current
		);
	};

	return (
		<ScreenModal
			styleContentBlock={{
				backgroundColor: "#FFF",
				borderTopLeftRadius: 20,
				borderTopRightRadius: 20,
				alignItems: "center",
				paddingHorizontal: "auto",
				width: window.width,
			}}
			styleNoContentElement={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			positionContentBlock={PositionContentBlock.Bottom}
		>
			<SelectTime
				start={type === "activate" ? [5, 0] : [35, 0]}
				end={type === "activate" ? [10, 0] : [45, 0]}
				onChange={time => {
					selectTime.current = (time[0] * 60 + time[1]) * 1000;
				}}
				style={styles.selectTime}
			/>
			<ColorButton
				styleButton={styles.button}
				styleText={styles.buttonText}
				onPress={() => {
					saveTime();
					navigation.goBack();
				}}
			>
				{i18n.t("ready")}
			</ColorButton>
		</ScreenModal>
		// <View style={{ flex: 1 }}>
		// 	<Pressable
		// 		style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", width: "100%", height: "100%" }}
		// 		onPress={() => navigation.goBack()}
		// 	/>
		// 	<View style={styles.container}>

		// 	</View>
		// </View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		paddingBottom: 30,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
	button: {
		backgroundColor: "#C2A9CE",
		height: 45,
		borderRadius: 100,
		paddingHorizontal: 25,
	},
	buttonText: {
		color: "#FFFFFF",
	},
	selectTime: {
		marginVertical: 9,
		height: 216,
	},
});

export default DMDSelectTimeBright;
