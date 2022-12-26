/** @format */

import React, { ElementRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";
import i18n from "~i18n";

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
		store.practice.paramsPractice.currentNameBackgroundSound,
		store.practice.paramsPractice.currentVolumeBackgroundSound,
	]);
	const dispatch = useAppDispatch();
	const TimeLineReference = useRef<ElementRef<typeof TimeLine>>(null);

	const offPlayBackgroundSound = useRef<{ (): Promise<void> } | null>(null);
	const changeVolumeCancel = useRef<() => void>();
	return (
		<View style={styles.background}>
			{backgroundImage && <Image blurRadius={2} source={backgroundImage} style={styles.background} />}
			<View
				style={[
					styles.contentWrapper,
					{ paddingTop: 55, backgroundColor: backgroundImage ? "rgba(0, 0, 0, 0.6)" : undefined },
				]}
			>
				<View style={styles.backgroundSoundList}>
					{Object.entries(BackgroundSound).map(item => (
						<Pressable
							key={item[0]}
							onPress={() => {
								if (selectBackgroundSound && selectBackgroundSound === item[0]) {
									dispatch(actions.editBackgroundMusic(null));
								} else {
									dispatch(actions.editBackgroundMusic(item[0] as keyof typeof BackgroundSound));
								}
							}}
							onLongPress={async () => {
								offPlayBackgroundSound.current = await playFragmentMeditationBackground(
									item[0] as keyof typeof BackgroundSound
								);
							}}
							onPressOut={async () => {
								if (offPlayBackgroundSound.current !== null) {
									await offPlayBackgroundSound.current();
									offPlayBackgroundSound.current = null;
								}
							}}
						>
							<Image
								source={item[1].image}
								style={[
									styles.iconBackgroundSound,
									selectBackgroundSound && selectBackgroundSound === item[0]
										? { borderColor: "#FFFFFF", borderWidth: 2 }
										: null,
								]}
							/>
							<Text style={styles.nameBackgroundSound}>{i18n.t(item[1].translate)}</Text>
						</Pressable>
					))}
				</View>
				<TimeLine
					ref={TimeLineReference}
					initValue={volume}
					onChange={percent => {
						if (changeVolumeCancel.current) changeVolumeCancel.current();
						const lastId = setTimeout(() => dispatch(actions.editBackgroundVolume(percent)), 100);
						changeVolumeCancel.current = () => {
							clearTimeout(lastId);
						};
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
		backgroundColor: "#9765A8",
	},
	contentWrapper: {
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
		paddingBottom: 30,
		paddingHorizontal: 20,
	},
	backgroundSoundList: {
		flexDirection: "row",
		paddingTop: 20,
		flexWrap: "wrap",
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
