/** @format */

import React, { ElementRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";

import { TimeLine } from "~components/dump";
import Tools from "~core";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";

import { BackgroundSound, playFragmentMeditationBackground } from "src/models/practices";
import { RootScreenProps } from "~types";
import { actions, useAppDispatch, useAppSelector } from "~store";

const SelectBackgroundSound: RootScreenProps<"SelectBackgroundSound"> = ({ navigation, route }) => {
	const { backgroundImage } = route.params;
	const [selectBackgroundSound, volume] = useAppSelector(store => [
		store.practice.selectBackgroundMusicName,
		store.practice.backgroundMusicVolume,
	]);
	const dispatch = useAppDispatch();
	const TimeLineRef = useRef<ElementRef<typeof TimeLine>>(null);

	const offPlayBackgroundSound = useRef<{ (): Promise<void> } | null>(null);
	const [zIndexMax, setZIndexMax] = useState<keyof typeof BackgroundSound | undefined>(undefined);

	const headerHeight = useHeaderHeight();

	const scalePressable: { [index: string]: SharedValue<number> } = {};
	const aStyle: { [index: string]: any } = {};

	for (let nameBackgroundSound of Object.keys(BackgroundSound)) {
		scalePressable[nameBackgroundSound] = useSharedValue(1);
		aStyle[nameBackgroundSound] = useAnimatedStyle(() => ({
			transform: [{ scale: withTiming(scalePressable[nameBackgroundSound].value) }],
		}));
	}

	return (
		<View style={styles.background}>
			{backgroundImage && <Image blurRadius={2} source={backgroundImage} style={styles.background} />}
			<View style={[styles.contentWrapper, { paddingTop: headerHeight }]}>
				<View style={styles.backgroundSoundList}>
					{Object.entries(BackgroundSound).map(item => (
						<Pressable
							style={{ zIndex: item[0] === zIndexMax ? 2 : 1 }}
							key={item[0]}
							onPress={() => {
								if (selectBackgroundSound && selectBackgroundSound === item[0]) {
									dispatch(actions.editBackgroundMusic(null));
								} else {
									dispatch(actions.editBackgroundMusic(item[0] as keyof typeof BackgroundSound));
								}
							}}
							onLongPress={async () => {
								setZIndexMax(item[0] as keyof typeof BackgroundSound);
								scalePressable[item[0]].value = 2;
								offPlayBackgroundSound.current = await playFragmentMeditationBackground(
									item[0] as keyof typeof BackgroundSound
								);
							}}
							onPressOut={async () => {
								if (offPlayBackgroundSound.current !== null) {
									await offPlayBackgroundSound.current();
									offPlayBackgroundSound.current = null;
								}
								scalePressable[item[0]].value = 1;
							}}
						>
							<Animated.View style={aStyle[item[0]]}>
								<Image
									source={item[1].image}
									style={[
										styles.iconBackgroundSound,
										selectBackgroundSound && selectBackgroundSound === item[0]
											? { borderColor: "#FFFFFF", borderWidth: 2 }
											: null,
									]}
								/>
								<Text style={styles.nameBackgroundSound}>{Tools.i18n.t(item[1].translate)}</Text>
							</Animated.View>
						</Pressable>
					))}
				</View>
				<TimeLine
					ref={TimeLineRef}
					initValue={volume}
					onChange={percent => {
						dispatch(actions.editBackgroundVolume(percent));
					}}
				/>
			</View>
		</View>
	);
};

export default SelectBackgroundSound;

const styles = StyleSheet.create({
	background: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	contentWrapper: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "space-between",
		paddingBottom: 30,
		paddingHorizontal: 20,
	},
	backgroundSoundList: {
		flexDirection: "row",
	},
	iconBackgroundSound: {
		borderRadius: 20,
		width: 65,
		height: 65,
		marginHorizontal: 12,
		marginVertical: 11,
	},
	nameBackgroundSound: {
		fontSize: 12,
		color: "#FFFFFF",
		textAlign: "center",
		...Tools.gStyle.font("500"),
	},
	title: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("700"),
		textAlign: "center",
	},
});
