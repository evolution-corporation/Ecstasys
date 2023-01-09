/** @format */

import React, { useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, Image, Pressable, View, Platform } from "react-native";
import { ColorButton, TextButton } from "~components/dump";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { Breathing, RootScreenProps } from "~types";
import i18n from "~i18n";
import gStyle from "~styles";
import { useFocusEffect } from "@react-navigation/native";
import { useDimensions } from "@react-native-community/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTimeNotificationDMD, { TimeSegments } from "src/hooks/use-time-notification-dmd";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import DescriptionText from "~components/Text/description-text";
import CustomPartText from "~components/Text/custom-part-text";
import ViewTimeDMDTimeSegments from "~components/dump/view-time-dmd-time-segments";
import ImageMeditationWitTimeTop from "~components/dump/image-meditation-with-time-top";
import DateTime from "src/global/class/date-time";
import SmallPlay from "assets/icons/SmallPlay.svg";
import ElementSimpleText from "~components/Text/element-simple-text";
import ViewRow from "~components/layouts/view-row";
import useSizeElement from "src/hooks/use-size-element";

const DMDSettingNotification: RootScreenProps<"DMDSettingNotification"> = ({ navigation, route }) => {
	const { selectedRelax, selectSet } = route.params;

	const [TimeSegment, setTimeNotification] = useTimeNotificationDMD();
	const [sizeBottomPart, setSizeBottomPart] = useSizeElement();

	const { window } = useDimensions();
	const sizeTopPart = sizeBottomPart
		? { height: Math.floor(window.height - sizeBottomPart?.height), width: window.width }
		: undefined;
	const resetTimeSegments = () => {
		setTimeNotification(TimeSegments.ActiveBreathing, 0);
		setTimeNotification(TimeSegments.SpontaneousBreathing, 0);
	};

	return (
		<View style={styles.container}>
			{sizeTopPart ? (
				<View style={[styles.imageHeader, { height: sizeTopPart.height }]}>
					<ImageMeditationWitTimeTop
						id={`practice.item.${selectedRelax.id}`}
						image={{ uri: selectedRelax.image }}
						time={new DateTime(selectSet.length + selectedRelax.length)}
						bottomContent={
							<ViewRow>
								<ViewPaddingList paddings={[0, 6, 0]} direction={Direction.Horizontal}>
									<SmallPlay />
									<ElementSimpleText color={"#FFF"}>{selectSet.name}</ElementSimpleText>
								</ViewPaddingList>
							</ViewRow>
						}
					/>
				</View>
			) : (
				<View />
			)}

			<View style={styles.footer} onLayout={({ nativeEvent: { layout } }) => setSizeBottomPart(layout)}>
				<ViewPaddingList paddings={[25, 22, 11, 32, 52]} direction={Direction.Vertical}>
					<DescriptionText>
						{i18n.t("efbd27b4-4e3c-4cfe-8328-0e085d16167e")}
						{"\n"}
						<CustomPartText fontWeight="600">{i18n.t("375f84c6-7680-438c-96fd-62b9eb0b25ed")}</CustomPartText>
					</DescriptionText>
					<ViewTimeDMDTimeSegments />
					<TextButton styleText={styles.backDefault} onPress={() => resetTimeSegments()}>
						{i18n.t("d61edffc-4710-4707-9ddc-3576780004fc")}
					</TextButton>
					<ColorButton
						styleButton={styles.meditationButton}
						styleText={styles.meditationButtonText}
						onPress={() => {
							navigation.navigate("PlayerForPractice", {
								selectedPractice: selectedRelax,
								selectSet,
								timeNotification: [
									{ type: Breathing.Active, time: TimeSegment.setup },
									{ type: Breathing.Spontaneous, time: TimeSegment.setup + TimeSegment.activeBreathing },
									{
										type: Breathing.Active,
										time: TimeSegment.setup + TimeSegment.activeBreathing + TimeSegment.spontaneousBreathing,
									},
								],
							});
						}}
					>
						{i18n.t("79dc5c1b-465a-4ead-bb4b-57fcf88af1d1")}
					</ColorButton>
				</ViewPaddingList>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
	},
	image: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	imageHeader: {
		overflow: "hidden",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		width: "100%",
	},
	description: {
		fontSize: 14,
		textAlign: "center",
		color: "#3D3D3D",
		...gStyle.font("400"),
		lineHeight: 17,
	},
	help: {
		...gStyle.font("600"),
	},
	footer: {
		width: "100%",
		paddingHorizontal: 20,

		justifyContent: "space-between",
	},
	containerTime: {
		width: "100%",
		height: 40,
		marginVertical: 5,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		paddingLeft: 9,
		paddingRight: 19,
		borderRadius: 10,
		backgroundColor: "#C2A9CE",
	},
	containerTimeText: {
		color: "#FFFFFF",
		fontSize: 14,
		...gStyle.font("500"),
	},
	containerTimeMiddle: {
		backgroundColor: "#9765A8",
	},
	backDefault: {
		color: "#9765A8",
		fontSize: 12,
		...gStyle.font("500"),
		alignSelf: "center",
	},
	meditationButton: {
		backgroundColor: "#9765A8",
		borderRadius: 15,
	},
	meditationButtonText: {
		color: "#FFFFFF",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	timeMinutes: {
		color: "#FFFFFF",
		fontSize: 14,
		...gStyle.font("600"),
	},
	timeMinutesBox: {
		borderRadius: 15,
		paddingHorizontal: 34,
		height: 30,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
	},
});

export default DMDSettingNotification;
