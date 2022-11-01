/** @format */

import React, { useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, Image, Pressable, View } from "react-native";
import { ColorButton, TextButton } from "~components/dump";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { RootScreenProps } from "~types";
import i18n from "~i18n";
import gStyle from "~styles";
import ArrowDown from "assets/icons/Chevron_Down.svg";
import { SharedElement } from "react-navigation-shared-element";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import { useHeaderHeight } from "@react-navigation/elements";
import { useDimensions } from "@react-native-community/hooks";

const DMDSettingNotification: RootScreenProps<"DMDSettingNotification"> = ({ navigation, route }) => {
	const { selectedRelax } = route.params;
	const [image, name] = useAppSelector(store => [
		store.DMD.option?.image ??
			"https://storage.yandexcloud.net/dmdmeditationimage/meditations/404-not-found-error-page-examples.png",
		store.DMD.set?.name ?? "404",
	]);
	const [activate, option, random, lengthSet] = useAppSelector(store => [
		store.DMD.configuratorNotification.activate,
		store.DMD.configuratorNotification.option ?? 0,
		store.DMD.configuratorNotification.random,
		store.DMD.set?.length ?? 0,
	]);
	const headerHeight = useHeaderHeight();
	const dispatch = useAppDispatch();

	const [heightTopView, setHeightTopView] = React.useState<number | null>(null);
	const { window } = useDimensions();
	useFocusEffect(
		useCallback(() => {
			StatusBar.setStatusBarTranslucent(true);
			StatusBar.setStatusBarStyle("light");
			navigation.setOptions({
				title: selectedRelax.name,
			});
		}, [])
	);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar.StatusBar style="light" hidden={false} translucent backgroundColor={undefined} />

			<View style={[styles.imageHeader, { height: heightTopView ?? 0 }]}>
				<SharedElement id={`practice.item.${selectedRelax.id}`} style={styles.image}>
					<Image
						source={{ uri: image }}
						style={{ width: "100%", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: "100%" }}
					/>
				</SharedElement>
				<View style={{ marginTop: headerHeight, flex: 1 }}>
					<LinearGradient style={styles.timeMinutesBox} colors={["#75348B", "#6A2382"]}>
						<Text style={styles.timeMinutes}>
							{i18n.t("minute", {
								count: Math.floor((lengthSet + selectedRelax.length) / 60000),
							})}
						</Text>
					</LinearGradient>
				</View>
			</View>
			<View
				style={styles.footer}
				onLayout={({ nativeEvent: { layout } }) => {
					if (heightTopView === null) setHeightTopView(window.height - layout.height);
				}}
			>
				<Text style={styles.description}>
					{i18n.t("efbd27b4-4e3c-4cfe-8328-0e085d16167e")}
					{"\n"}
					<Text style={styles.help}>{i18n.t("375f84c6-7680-438c-96fd-62b9eb0b25ed")}</Text>
				</Text>
				<View>
					<View key={"options"} style={styles.containerTime}>
						<Text style={styles.containerTimeText}>1. {i18n.t("489177eb-1aa7-4fb7-9963-8abfe4cbf63e")}</Text>
						<Text style={styles.containerTimeText}>{i18n.strftime(new Date(option), "%M:%S")}</Text>
					</View>
					<Pressable
						key={"activate"}
						style={[styles.containerTime, styles.containerTimeMiddle]}
						onPress={() => navigation.navigate("DMDSelectTimeBright", { type: "activate" })}
					>
						<Text style={styles.containerTimeText}>2. {i18n.t("a3278599-1f56-437e-9dec-878f88e33abe")}</Text>
						<View style={styles.row}>
							<Text style={styles.containerTimeText}>{i18n.strftime(new Date(activate), "%M:%S")}</Text>
							<ArrowDown />
						</View>
					</Pressable>
					<Pressable
						key={"random"}
						style={[styles.containerTime, styles.containerTimeMiddle]}
						onPress={() => navigation.navigate("DMDSelectTimeBright", { type: "random" })}
					>
						<Text style={styles.containerTimeText}>3. {i18n.t("d08f1ccf-6c67-41bc-afff-f65373c7b00c")}</Text>
						<View style={styles.row}>
							<Text style={styles.containerTimeText}>{i18n.strftime(new Date(random), "%M:%S")}</Text>
							<ArrowDown />
						</View>
					</Pressable>
					<View key={"free"} style={styles.containerTime}>
						<Text style={styles.containerTimeText}>4. {i18n.t("5031cd30-0010-42e1-8d47-7516d63e2a6a")}</Text>
						<Text style={styles.containerTimeText}>
							{i18n.strftime(new Date(lengthSet - activate - random), "%M:%S")}
						</Text>
					</View>
					<TextButton
						style={styles.backDefault}
						onPress={() => {
							dispatch(actions.setTimeConfiguratorForDMD({ type: "action", value: 0 }));
							dispatch(actions.setTimeConfiguratorForDMD({ type: "random", value: 0 }));
						}}
					>
						{i18n.t("d61edffc-4710-4707-9ddc-3576780004fc")}
					</TextButton>
				</View>
				<ColorButton
					styleButton={styles.meditationButton}
					styleText={styles.meditationButtonText}
					onPress={() => {
						navigation.navigate("PlayerForDMD", { selectedRelax });
					}}
				>
					{i18n.t("79dc5c1b-465a-4ead-bb4b-57fcf88af1d1")}
				</ColorButton>
			</View>
		</SafeAreaView>
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
		marginBottom: 22,
	},
	help: {
		...gStyle.font("600"),
	},
	footer: {
		width: "100%",
		paddingHorizontal: 20,
		paddingTop: 25,
		paddingBottom: 50,
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
		color: "#C2A9CE",
		fontSize: 12,
		...gStyle.font("500"),
		alignSelf: "center",
		marginTop: 11,
		marginBottom: 20,
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
