/** @format */

import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	cancelAnimation,
	Easing,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useKeepAwake } from "expo-keep-awake";

import Tools from "~core";
import core from "~core";

import { RootScreenProps } from "~types";

import { useDimensions } from "@react-native-community/hooks";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import useMeditation from "src/hooks/use-meditation";
import useBackgroundSound from "src/hooks/use-background-sound";
import useTimer from "src/hooks/use-timer";
import BackgroundSoundButton from "~components/dump/background-sound-button";

import LockIcon from "assets/icons/Lock.svg";
import i18n from "~i18n";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

const PlayerMeditationOnTheMandala: RootScreenProps<"PlayerMeditationOnTheMandala"> = ({ navigation, route }) => {
	const { isNeedVoice, practiceLength } = route.params;

	const [mandala, setMandala] = React.useState<ImageSourcePropType>(
		require("assets/BaseMeditaionAssets/Mandala/Base.png")
	);

	const [hiddenUI, setHiddenUI] = React.useState(false);

	const isSubscribe = useIsActivateSubscribe();

	const timer = useTimer(practiceLength, () => navigation.navigate("EndMeditation"));

	const meditation = isNeedVoice
		? useMeditation(
				[
					{
						uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/baseSound/ce3cbe90-fb99-4437-bcaa-e4b8eae0d0dc",
					},
				],
				timer.currentMilliseconds,
				{ autoPlay: true }
		  )
		: undefined;


	useEffect(() => {
		timer.play();
	}, []);

	const backgroundSound = useBackgroundSound(true);

	const rotateMandala = useSharedValue("0deg");
	useKeepAwake();
	const styleMandala = useAnimatedStyle(() => ({
		transform: [{ rotateZ: rotateMandala.value }],
		position: "absolute",
		width: "100%",
		height: "100%",
	}));

	const [isRotateMandala, setIsRotateMandala] = useState<boolean>(true);

	const startRotateMandala = () => {
		const nextValue = Number(rotateMandala.value.replace("deg", ""));
		rotateMandala.value = withRepeat(
			withTiming(`${nextValue + 360}deg`, { duration: 60000, easing: Easing.linear }),
			-1,
			false
		);
	};

	const stopRotateMandala = () => {
		cancelAnimation(rotateMandala);
	};

	useEffect(() => {
		if (isRotateMandala) {
			startRotateMandala();
		} else {
			stopRotateMandala();
		}
	}, [isRotateMandala]);

	const { window } = useDimensions();

	useEffect(() => {
		navigation.setOptions({ headerShown: !hiddenUI });
	}, [hiddenUI]);

	return (
		<View style={styles.background}>
			<Pressable style={{ flex: 1 }} onPress={() => setHiddenUI(prevState => !prevState)}>
				<View
					style={{
						width: window.width,
						height: window.height,
						position: "absolute",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Pressable
						onPress={() => setIsRotateMandala(prevState => !prevState)}
						style={{
							width: window.width - 40,
							height: window.width - 40,
							// alignItems: "center",
							// justifyContent: "center",
						}}
					>
						<Animated.View style={styleMandala}>
							<Image source={mandala} style={{ width: "100%", height: "100%" }} />
						</Animated.View>
					</Pressable>
				</View>
				{!hiddenUI && (
					<>
						<Animated.View
							style={{ width: window.width, height: window.height, justifyContent: "center", alignItems: "center" }}
							entering={FadeIn}
							exiting={FadeOut}
						>
							<View style={styles.timesCodeBox}>
								<Text style={styles.timeCode} key={"current"}>
									{i18n.strftime(new Date(timer.currentMilliseconds), "%M:%S")}
								</Text>
							</View>
						</Animated.View>
						<Animated.View style={[styles.timeInfoBox]} entering={FadeIn} exiting={FadeOut}>
							<FlatList
								data={[
									{ name: "Base", uri: require("assets/BaseMeditaionAssets/Mandala/Base.png") },
									{ name: "Premium1", uri: require("assets/BaseMeditaionAssets/Mandala/Premium1.png") },
									{ name: "Premium2", uri: require("assets/BaseMeditaionAssets/Mandala/Premium2.png") },
									{ name: "Premium3", uri: require("assets/BaseMeditaionAssets/Mandala/Premium3.png") },
									{ name: "Premium4", uri: require("assets/BaseMeditaionAssets/Mandala/Premium4.png") },
									{ name: "Premium5", uri: require("assets/BaseMeditaionAssets/Mandala/Premium5.png") },
								]}
								renderItem={({ item }) => (
									<Pressable
										onPress={() => {
											if (item.name === "Base" || isSubscribe) {
												setMandala(item.uri);
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
						</Animated.View>
					</>
				)}
			</Pressable>
		</View>
	);
};

export default PlayerMeditationOnTheMandala;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#000000",
		flex: 1,
		justifyContent: "space-between",
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
		paddingHorizontal: 20,
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
});
