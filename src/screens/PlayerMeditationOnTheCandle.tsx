/** @format */

import React, { useEffect, useRef } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useKeepAwake } from "expo-keep-awake";

import Tools from "~core";
import core from "~core";

import { RootScreenProps } from "~types";
import i18n from "~i18n";

import { useDimensions } from "@react-native-community/hooks";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import useMeditation from "src/hooks/use-meditation";
import useBackgroundSound from "src/hooks/use-background-sound";
import useTimer from "src/hooks/use-timer";
import BackgroundSoundButton from "~components/dump/background-sound-button";
import { ResizeMode, Video } from "expo-av";
import LockIcon from "~assets/icons/Lock.svg";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

const PlayerMeditationOnTheCandle: RootScreenProps<"PlayerMeditationOnTheCandle"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;

	const [candle, setCandle] = React.useState<ImageSourcePropType>(require("~assets/Candle.gif"));

	const [isShowTime, setIsShowTime] = React.useState(true);

	const isSubscribe = useIsActivateSubscribe();

	const timer = useTimer(practiceLength, () => navigation.navigate("EndMeditation"));

	const meditation = isNeedVoice
		? useMeditation([require("~assets/Candle.mp3")], timer.currentMilliseconds, { autoPlay: true })
		: undefined;

	useEffect(() => {
		if (meditation !== undefined) {
			meditation.play();
		}
	}, [meditation]);

	const video = useRef<Video>(null);

	useEffect(() => {
		timer.play();
		if (video.current) video.current.playAsync();
		return () => {
			if (video.current) video.current.stopAsync();
		};
	}, []);

	const backgroundSound = useBackgroundSound(true);

	useKeepAwake();

	const { window } = useDimensions();
	return (
		<View style={styles.background}>
			<Pressable
				onPress={() => setIsShowTime(prevState => !prevState)}
				style={{
					alignSelf: "center",
					width: window.width - 40,
					height: window.width - 40,
					alignItems: "center",
					justifyContent: "center",
					position: "absolute",
					bottom: "40%",
				}}
			>
				<Image
					// ref={video}
					style={styles.video}
					// source={require("~assets/Candle.mp4")}
					resizeMode={ResizeMode.CONTAIN}
					source={candle}
					// isLooping
				/>
				{isShowTime && (
					<View style={styles.timesCodeBox}>
						<Text style={styles.timeCode} key={"current"}>
							{i18n.strftime(new Date(timer.currentMilliseconds), "%M:%S")}
						</Text>
					</View>
				)}
			</Pressable>
			<View style={[styles.timeInfoBox]}>
				<FlatList
					data={[
						{ name: "Base", uri: require("assets/BaseMeditaionAssets/Mandala/Base.png") },
						{ name: "Premium1", uri: require("assets/BaseMeditaionAssets/Mandala/Premium1.png") },
						{ name: "Premium2", uri: require("assets/BaseMeditaionAssets/Mandala/Premium2.png") },
						{ name: "Premium3", uri: require("assets/BaseMeditaionAssets/Mandala/Premium3.png") },
					]}
					renderItem={({ item }) => (
						<Pressable
							onPress={() => {
								if (item.name === "Base" || isSubscribe) {
									setCandle(item.uri);
								} else {
									navigation.navigate("ByMaySubscribe");
								}
							}}
						>
							<Image source={item.uri} style={{ width: 70, height: 70 }} />
							{item.name === "Base" || isSubscribe ? null : (
								<View
									style={{
										width: 70,
										height: 70,
										justifyContent: "center",
										alignItems: "center",
										position: "absolute",
										backgroundColor: "rgba(0,0,0,0.5)",
									}}
								>
									<View style={{ transform: [{ scale: 0.6 }] }}>
										<LockIcon />
									</View>
								</View>
							)}
						</Pressable>
					)}
					horizontal
					keyExtractor={item => item.name}
					style={{ left: 0, right: 0, marginHorizontal: -20, marginBottom: 30 }}
					ItemSeparatorComponent={() => <View style={{ width: 29 }} />}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				/>
				<View style={{ alignSelf: "flex-start", marginTop: 17 }}>
					<BackgroundSoundButton image={undefined} name={backgroundSound.name} />
				</View>
			</View>
		</View>
	);
};

export default PlayerMeditationOnTheCandle;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#000000",
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingBottom: 37,
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	imageBackground: {
		width: "100%",
		height: "100%",
	},
	timeInfoBox: {
		width: "100%",
		position: "absolute",
		alignSelf: "center",
		bottom: 28,
		alignItems: "flex-start",
	},
	timesCodeBox: {
		width: 196,
		height: 196,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 98,
		backgroundColor: "rgba(61, 61, 61, 0.5)",
	},
	timeCode: {
		fontSize: 48,
		color: "#FFFFFF",
		...Tools.gStyle.font("400"),
	},
	buttonBackgroundSound: {
		alignSelf: "flex-start",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		paddingRight: 33,
		paddingLeft: 13,
		height: 50,
		borderRadius: 25,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	buttonBackgroundText: {
		color: "#FFFFFF",
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
	panelControlContainer: {
		alignSelf: "center",
		position: "absolute",
		width: "100%",
		top: "50%",
	},
	video: {
		width: "100%",
		height: 458,
		position: "absolute",
		right: "-15%",
	},
});
