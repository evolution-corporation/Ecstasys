/** @format */

import React, { ElementRef, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import i18n from "~i18n";

import { TimeLine } from "~components/dump";
import Tools from "~core";

import { BackgroundSound, playFragmentMeditationBackground } from "src/models/practices";
import { RootScreenProps } from "~types";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { useDimensions } from "@react-native-community/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Headphones from "assets/icons/iPhone 11 Pro-Media-Headphones.svg";

const SelectBackgroundSound: RootScreenProps<"SelectBackgroundSound"> = ({ navigation, route }) => {
	const { backgroundImage } = route.params;
	const [selectBackgroundSound, volume] = useAppSelector(store => [
		store.practice.paramsPractice.currentNameBackgroundSound,
		store.practice.paramsPractice.currentVolumeBackgroundSound,
	]);
	const { window } = useDimensions();
	const dispatch = useAppDispatch();
	const TimeLineReference = useRef<ElementRef<typeof TimeLine>>(null);

	const offPlayBackgroundSound = useRef<{ (): Promise<void> } | null>(null);
	const changeVolumeCancel = useRef<() => void>();
	const widthItem = (window.width - 40 - 15 * 3) / 4;
	const widthImageItem = widthItem * 0.8;
	const insets = useSafeAreaInsets();

	return (
		<View style={styles.background}>
			{backgroundImage && <Image blurRadius={2} source={backgroundImage} style={styles.background} />}
			<View
				style={[
					styles.contentWrapper,
					{ paddingTop: 55 + insets.top, backgroundColor: backgroundImage ? "rgba(0, 0, 0, 0.6)" : undefined },
				]}
			>
				<View style={styles.backgroundSoundList}>
					{Object.entries(BackgroundSound).map((item, index) => (
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
							style={{ width: widthItem, marginHorizontal: 7.5, alignItems: "center" }}
						>
							<Image
								source={item[1].image}
								style={[
									styles.iconBackgroundSound,
									{ width: widthImageItem, height: widthImageItem },
									selectBackgroundSound && selectBackgroundSound === item[0]
										? { borderColor: "#FFFFFF", borderWidth: 2 }
										: null,
								]}
							/>
							<Text style={styles.nameBackgroundSound}>{i18n.t(item[1].translate)}</Text>
						</Pressable>
					))}
				</View>
				<View style={{ transform: [{ translateY: -30 }], paddingHorizontal: 5 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							width: "100%",
							alignItems: "center",
							paddingLeft: 2.5,
						}}
					>
						<Headphones />
						<Text style={{ color: "#FFF", ...Tools.gStyle.font("400"), fontSize: 14, marginLeft: 7 }}>
							Громкость фоновой музыки
						</Text>
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
		paddingHorizontal: 12.5,
	},
	backgroundSoundList: {
		flexDirection: "row",
		paddingTop: 20,
		flexWrap: "wrap",
	},
	iconBackgroundSound: {
		borderRadius: 20,
		marginVertical: 11,
	},
	nameBackgroundSound: {
		fontSize: 11,
		color: "#FFFFFF",
		textAlign: "center",
		width: "100%",
		textAlignVertical: "center",
		...Tools.gStyle.font("500"),
	},
	title: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("700"),
		textAlign: "center",
	},
});
