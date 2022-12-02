/** @format */

import React, { useMemo, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, Animated, useWindowDimensions, PanResponder, Easing } from "react-native";
import { ColorButton, SelectBirthday } from "~components/dump";
import Tools from "~core";
import { RootScreenProps } from "~types";
import i18n from "~i18n";
import { actions, useAppDispatch, useAppSelector } from "~store";
import useUserInformation from "src/hooks/use-user-information";

const EditUserBirthday: RootScreenProps<"EditUserBirthday"> = ({ navigation }) => {
	const { height, width } = useWindowDimensions();
	const position = useRef<Animated.Value>(new Animated.Value(0)).current;

	const { birthday, setValue } = useUserInformation();

	const [contentSizeHeight, setContentSizeHeight] = useState<number | null>(null);
	const nextBirthday = useRef<Date | null>(null);
	const horizontalPaddingContent = useRef<{
		left: number;
		right: number;
	}>({ left: 0, right: 0 });
	const ordinateTopLine = useMemo(
		() => (contentSizeHeight ? height - contentSizeHeight - 80 : 0),
		[height, contentSizeHeight]
	);
	const pan = useMemo(
		() =>
			PanResponder.create({
				onMoveShouldSetPanResponder: (_, gestureState) => {
					return !(
						gestureState.moveX > horizontalPaddingContent.current.left &&
						gestureState.moveX < horizontalPaddingContent.current.right
					);
				},
				onPanResponderMove: (_, gestureState) => {
					if (contentSizeHeight) {
						const offset = gestureState.moveY - ordinateTopLine;
						if (offset <= -contentSizeHeight * 0.5 || offset >= contentSizeHeight * 0.8) {
							return false;
						}
						position.setValue(offset);
					}
				},
				onPanResponderTerminationRequest: (_, gestureState) => {
					Animated.timing(position, {
						toValue: 0,
						useNativeDriver: true,
						easing: Easing.bounce,
					}).start();
					return true;
				},
				onPanResponderRelease: (_, gestureState) => {
					let offset = gestureState.moveY - ordinateTopLine;
					if (contentSizeHeight) {
						if (offset <= -contentSizeHeight * 0.5) {
							offset = -contentSizeHeight * 0.5;
						} else if (offset >= contentSizeHeight * 0.8) {
							offset = contentSizeHeight * 0.8;
						}
						if (gestureState.dy > 0 && offset >= contentSizeHeight * 0.8) {
							navigation.goBack();
						} else {
							Animated.timing(position, {
								toValue: 0,
								useNativeDriver: true,
								easing: Easing.bounce,
							}).start();
						}
					}
				},
			}),
		[contentSizeHeight]
	);

	return (
		<View style={{ flex: 1 }}>
			<Pressable style={{ flexGrow: 1 }} onPress={() => navigation.goBack()} />
			<Animated.View
				style={[
					styles.background,
					contentSizeHeight
						? {
								height: contentSizeHeight * 2,
								bottom: -contentSizeHeight + 80,
						  }
						: null,
					{ transform: [{ translateY: position }] },
				]}
				{...pan.panHandlers}
			>
				<Text style={styles.title}>{i18n.t("3186e946-022f-4eb9-bab8-ea115a392ae2")}</Text>
				<SelectBirthday
					onChange={date => {
						nextBirthday.current = date;
					}}
					onLayout={({ nativeEvent: { layout } }) => {
						const padding = (width - layout.width) / 2 - 15;
						horizontalPaddingContent.current = {
							left: padding,
							right: width - padding,
						};
					}}
					init={new Date(birthday)}
				/>
				<ColorButton
					styleButton={styles.button}
					onPress={() => {
						if (nextBirthday.current) {
							setValue({ birthday: nextBirthday.current ?? undefined });
							navigation.goBack();
						}
					}}
				>
					{i18n.t("save")}
				</ColorButton>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		width: "100%",
		height: 450,
		backgroundColor: "rgba(112, 45, 135, 1)",
		alignItems: "center",
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		paddingTop: 27,
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
	},
});

export default EditUserBirthday;
