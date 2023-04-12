/** @format */

import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Tools from "~core";
import { RootScreenProps } from "~types";
import CloseIcon from "assets/icons/CloseVioler.svg";
import ColorPicker, { BrightnessSlider, Panel2 } from "reanimated-color-picker";
import { useDimensions } from "@react-native-community/hooks";
import Animated from "react-native-reanimated";
import { actions, useAppDispatch, useAppSelector } from "~store";

const ChangeColorDot: RootScreenProps<"ChangeColorDot"> = ({ navigation, route }) => {
	const { window } = useDimensions();
	const dispatch = useAppDispatch();
	const currentColor = useAppSelector(store => store.practice.colorDor as string);
	const selectColor = useRef<{ color: string }>({ color: currentColor }).current;
	const save = () => {
		dispatch(actions.changeColorDot(selectColor.color));
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			<Pressable style={{ flexGrow: 1 }} onPress={() => navigation.goBack()} />
			<View style={[styles.background]}>
				<View
					style={{
						height: 60,
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						paddingHorizontal: 20,
					}}
				>
					<Pressable onPress={save} style={{ paddingVertical: 5, justifyContent: "center" }}>
						<Text style={{ color: "#9765A8", fontSize: 14, ...Tools.gStyle.font("400") }}>СОХРАНИТЬ</Text>
					</Pressable>
					<Pressable onPress={() => navigation.goBack()}>
						<CloseIcon />
					</Pressable>
				</View>
				<View style={{ width: window.width, height: 245 }}>
					<ColorPicker
						onComplete={e => {
							selectColor.color = e.hex;
						}}
						style={{ width: "100%", height: "100%" }}
						value={selectColor.color}
					>
						<Panel2
							imageSource={require("assets/colorSelector.png")}
							boundedThumb
							thumbSize={19}
							style={{ borderRadius: 0 }}
						/>
						<BrightnessSlider
							style={{ marginHorizontal: 20, height: 10, borderRadius: 10, marginVertical: 20 }}
							thumbShape={"solid"}
							boundedThumb
							thumbSize={19}
							sliderThickness={10}
							thumbColor={"#FFF"}
							reverse
							renderThumb={({ positionStyle }) => (
								<Animated.View
									style={[
										{
											width: 19,
											height: 19,
											borderRadius: 20,
											backgroundColor: "#FFF",
											...Tools.gStyle.shadows(1, 4),
											shadowColor: "rgba(0,0,0, 1)",
											shadowOpacity: 0.25,
										},
										positionStyle,
									]}
								/>
							)}
						/>
					</ColorPicker>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		width: "100%",
		height: 400,
		backgroundColor: "#FFF",
		alignItems: "center",
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		paddingBottom: 48,
		position: "absolute",
		bottom: -50,
	},
	title: {
		fontSize: 20,
		lineHeight: 24,
		color: "#FFFFFF",
		...Tools.gStyle.font("700"),
		marginBottom: 27,
		width: 250,
		textAlign: "center",
	},
	button: {
		marginTop: 43,
		paddingHorizontal: 25,
		marginHorizontal: 20,
	},
});

export default ChangeColorDot;
