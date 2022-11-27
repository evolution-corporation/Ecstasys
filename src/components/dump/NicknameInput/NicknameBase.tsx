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
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import i18n from "~i18n";
import gStyle from "~styles";
import CheckMarkerWhite from "assets/icons/CheckMarkerWhite.svg";
import CrossMarkerWhite from "assets/icons/CrossMarker_White.svg";
import { isNicknameValidate } from "src/validators";
import PromiseCustom from "src/Promise";

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
		onFocus,
		onBlur,
	} = props;
	const [statusCheck, setStatusCheck] = useState<StatusCheck>(StatusCheck.AWAIT);
	const [nickname, setNickname] = useState<string>(defaultValue);

	const PromiseChecked = React.useRef<PromiseCustom<StatusCheck, undefined, StatusCheck> | null>(null);

	const _colorBorderView = useSharedValue(0);

	const animatedView = useAnimatedStyle(() => {
		return {
			borderColor: interpolateColor(
				_colorBorderView.value,
				[0, 0.5, 1],
				["rgb(194,169,206)", "rgb(219,138,122)", "rgb(255,92,0)"],
				"RGB"
			),
		};
	});

	const editNickname = async (inputNickname: string) => {
		if (PromiseChecked.current !== null) {
			PromiseChecked.current.cancel();
		}
		setNickname(inputNickname);
		PromiseChecked.current = new PromiseCustom<StatusCheck, undefined, StatusCheck>(
			async (resolve, reject, returnMiddle, cancelSignal) => {
				if (inputNickname === defaultValue || inputNickname.length === 0) {
					return resolve(StatusCheck.AWAIT);
				}
				returnMiddle(StatusCheck.LOADING);
				if (isNicknameValidate(inputNickname)) {
					const result = await checkValidateNickname(inputNickname);
					return resolve(result);
				} else {
					return resolve(StatusCheck.INCORRECT);
				}
			},
			false
		);
		PromiseChecked.current
			.getMiddle(statusCheck => {
				setStatusCheck(statusCheck);
			})
			.finally(statusCheck => {
				setStatusCheck(statusCheck);
			})
			.start();
	};

	useEffect(() => {
		if (statusCheck === StatusCheck.INCORRECT || statusCheck === StatusCheck.USED) {
			_colorBorderView.value = withTiming(1);
		} else {
			_colorBorderView.value = withTiming(0);
		}
		if (!!onEndChange) {
			onEndChange(nickname, statusCheck);
		}
	}, [statusCheck]);

	useImperativeHandle(ref, () => ({
		editNickname,
	}));

	let [StatusCheckView, StatusCheckText] = React.useMemo(() => {
		switch (statusCheck) {
			case StatusCheck.USED:
			case StatusCheck.INCORRECT:
				return [
					<Pressable
						onPress={() => {
							editNickname("");
						}}
						key={"checkMarkerWhite"}
					>
						<CrossMarkerWhite />
					</Pressable>,
					StatusCheck.INCORRECT
						? i18n.t("d6a4f1c4-4344-4712-ac61-0c81292d0994")
						: i18n.t("564efb95-c192-4406-830f-13b3612bae0e"),
				];
			case StatusCheck.FREE:
				return [<CheckMarkerWhite key={"checkMarkerWhite"} />, null];
			case StatusCheck.LOADING:
				return [<ActivityIndicator color={"#FFFFFFFF"} size={"small"} key={"activityIndicator"} />, null];
			default:
				return [<View key={"await"} />, null];
		}
	}, [statusCheck]);

	return (
		<>
			<Animated.View style={[styles.backgroundTextInput, styleNicknameInputView, animatedView]}>
				<TextInput
					onChangeText={text => editNickname(text)}
					style={[styles.textInputView, styleNicknameInputText]}
					value={nickname}
					placeholderTextColor={"#C2A9CE"}
					maxLength={16}
					placeholder={i18n.t("f212a1ac-9688-4671-bbd1-6cbe20662ad7")}
					autoCapitalize={"none"}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<View style={styles.indicatorImage}>{StatusCheckView}</View>
			</Animated.View>
			{StatusCheckText !== null ? <Text style={styles.errorMessage}>{StatusCheckText}</Text> : null}
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
		...gStyle.font("400"),
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
		marginTop: 4,
		...gStyle.font("400"),
		textAlign: "center",
		color: "#E7DDEC",
	},
});

export default NicknameInput;
