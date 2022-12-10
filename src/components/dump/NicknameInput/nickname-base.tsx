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
import DefaultText from "~components/Text/default-text";

export enum StatusCheck {
	"FREE",
	"USED",
	"INCORRECT",
	"LOADING",
	"AWAIT",
}

const NicknameInput = forwardRef<Reference, Props>((properties, reference) => {
	const {
		styleNicknameInputView,
		styleNicknameInputText,
		defaultValue = "",
		onEndChange,
		checkValidateNickname,
		onFocus,
		onBlur,
	} = properties;
	const [statusCheck, setStatusCheck] = useState<StatusCheck>(StatusCheck.AWAIT);
	const [nickname, setNickname] = useState<string>(defaultValue);

	const PromiseChecked = React.useRef<PromiseCustom<StatusCheck, undefined, StatusCheck> | null>(null);

	const colorBorderView = useSharedValue(0);

	const animatedView = useAnimatedStyle(() => {
		return {
			borderColor: interpolateColor(
				colorBorderView.value,
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
			.getMiddle(statusCheckRequest => {
				setStatusCheck(statusCheckRequest);
			})
			.finally(statusCheckRequest => {
				setStatusCheck(statusCheckRequest);
			})
			.start();
	};

	useEffect(() => {
		colorBorderView.value =
			statusCheck === StatusCheck.INCORRECT || statusCheck === StatusCheck.USED ? withTiming(1) : withTiming(0);
		if (!!onEndChange) {
			onEndChange(nickname, statusCheck);
		}
	}, [statusCheck]);

	useImperativeHandle(reference, () => ({
		editNickname,
	}));

	const [StatusCheckView, StatusCheckText] = React.useMemo(() => {
		switch (statusCheck) {
			case StatusCheck.USED:
			case StatusCheck.INCORRECT: {
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
			}
			case StatusCheck.FREE: {
				return [<CheckMarkerWhite key={"checkMarkerWhite"} />, undefined];
			}
			case StatusCheck.LOADING: {
				return [<ActivityIndicator color={"#FFFFFFFF"} size={"small"} key={"activityIndicator"} />, undefined];
			}
			default: {
				return [<View key={"await"} />, undefined];
			}
		}
	}, [statusCheck]);

	return (
		<>
			<Animated.View
				style={[{ width: "100%", height: "100%", flexDirection: "row" }, styleNicknameInputView, animatedView]}
			>
				<TextInput
					onChangeText={text => editNickname(text)}
					style={[{ color: "#FFFFFF", fontSize: 14, ...gStyle.font("400"), flex: 1 }, styleNicknameInputText]}
					value={nickname}
					placeholderTextColor={"#C2A9CE"}
					maxLength={16}
					placeholder={i18n.t("f212a1ac-9688-4671-bbd1-6cbe20662ad7")}
					autoCapitalize={"none"}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<View style={{ minWidth: 20, height: "100%", alignItems: "center", justifyContent: "center" }}>
					{StatusCheckView}
				</View>
			</Animated.View>
			{StatusCheckText === undefined ? undefined : <DefaultText color={"#E7DDEC"}>{StatusCheckText}</DefaultText>}
		</>
	);
});

export interface NicknameBaseProperties extends TextInputProps {
	styleNicknameInputText?: TextStyle;
	styleNicknameInputView?: ViewStyle;
	onEndChange?: (nickname: string, statusCheck: StatusCheck) => void;
	checkValidateNickname: (nickname: string) => Promise<StatusCheck>;
}

export interface Reference {
	editNickname: (nickname: string) => void;
}

export default NicknameInput;
