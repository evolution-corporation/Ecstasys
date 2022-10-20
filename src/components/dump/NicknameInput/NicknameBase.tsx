/** @format */

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import CheckMarkerWhite from "assets/icons/CheckMarkerWhite.svg";
import { isNicknameValidate } from "src/validators";
import { Users } from "src/models";
import Tools from "~core";

export enum StatusCheck {
	"FREE",
	"USED",
	"INCORRECT",
	"LOADING",
	"AWAIT",
}

const NicknameInput = forwardRef<Ref, Props>((props, ref) => {
	const {
		styleNicknameInputView,
		styleNicknameInputText,
		defaultValue = "",
		onEndChange,
		checkValidateNickname,
	} = props;
	const [statusCheck, setStatusCheck] = useState<StatusCheck>(StatusCheck.AWAIT);
	const [nickname, setNickname] = useState<string>(defaultValue);

	const _colorBorderView = useSharedValue("#FF5C00");

	const animatedView = useAnimatedStyle(() => ({
		borderColor: withTiming(_colorBorderView.value),
	}));

	const editNickname = async (inputNickname: string) => {
		setNickname(inputNickname);
		if (inputNickname === defaultValue || inputNickname.length === 0) {
			setStatusCheck(StatusCheck.AWAIT);
			return;
		}
		setStatusCheck(StatusCheck.LOADING);
		if (isNicknameValidate(inputNickname)) {
			const result = await checkValidateNickname(inputNickname);
			setStatusCheck(result);
		} else {
			setStatusCheck(StatusCheck.INCORRECT);
			return;
		}
	};

	useEffect(() => {
		if ([StatusCheck.INCORRECT, StatusCheck.USED].includes(statusCheck)) {
			_colorBorderView.value = "#FF5C00";
		} else {
			_colorBorderView.value = "#C2A9CE";
		}
		if (!!onEndChange) {
			onEndChange(nickname, statusCheck);
		}
	}, [statusCheck]);

	useImperativeHandle(ref, () => ({
		editNickname,
	}));

	let [StatusCheckView, StatusCheckText] = (() => {
		switch (statusCheck) {
			case StatusCheck.AWAIT:
				return [<ActivityIndicator color={"#FFFFFFFF"} size={"small"} />, null];
			case StatusCheck.USED:
			case StatusCheck.INCORRECT:
				return [
					<Pressable
						onPress={() => {
							editNickname("");
						}}
					>
						<CheckMarkerWhite />
					</Pressable>,
					StatusCheck.INCORRECT
						? Tools.i18n.t("d6a4f1c4-4344-4712-ac61-0c81292d0994")
						: Tools.i18n.t("564efb95-c192-4406-830f-13b3612bae0e"),
				];
			case StatusCheck.FREE:
				return [<CheckMarkerWhite />, null];
			default:
				return [null, null];
		}
	})();

	return (
		<>
			<Animated.View style={[styles.backgroundTextInput, styleNicknameInputView, animatedView]}>
				<TextInput
					onChangeText={text => editNickname(text)}
					style={[styles.textInputView, styleNicknameInputText]}
					value={nickname}
					placeholderTextColor={"#C2A9CE"}
					maxLength={16}
					placeholder={Tools.i18n.t("f212a1ac-9688-4671-bbd1-6cbe20662ad7")}
					autoCapitalize={"none"}
				/>
				<View style={styles.indicatorImage}>{StatusCheckView}</View>
			</Animated.View>
			<Text style={styles.errorMessage}>{StatusCheckText}</Text>
		</>
	);
});

export interface Props extends TextInputProps {
	styleNicknameInputText?: TextStyle;
	styleNicknameInputView?: ViewStyle;
	onEndChange?: (nickname: string, statusCheck: StatusCheck) => void;
	checkValidateNickname: (nickname: string) => Promise<StatusCheck>;
}

export interface Ref {
	editNickname: (nickname: string) => void;
}

const styles = StyleSheet.create({
	textInputView: {
		color: "#FFFFFF",
		fontSize: 14,
		...Tools.gStyle.font("400"),
		flex: 1,
		paddingRight: 44,
	},
	backgroundTextInput: {
		width: "100%",
		height: 45,
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 15,
		backgroundColor: "rgba(240, 242, 238, 0.19)",
		paddingHorizontal: 15,
	},
	indicatorImage: {
		minWidth: 20,
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	errorMessage: {
		fontSize: 13,
		lineHeight: 16,
		...Tools.gStyle.font("400"),
		textAlign: "center",
		color: "#E7DDEC",
	},
});

export default NicknameInput;
