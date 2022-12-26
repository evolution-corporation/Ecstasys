/** @format */

import React, { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Pressable, BackHandler, Platform } from "react-native";
import auth from "@react-native-firebase/auth";

import { ColorButton } from "~components/dump";
import Tools from "~core";
import { RootScreenProps } from "~types";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { converterDisplayNameToNickname, generateNickname } from "~tools";
import NicknameBase, { StatusCheck } from "~components/dump/NicknameInput/nickname-base";
import i18n from "~i18n";

import CheckMarkerGreen from "~assets/icons/CheckMarkerGreen.svg";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useBackHandler } from "@react-native-community/hooks";
import { Screen } from "~components/containers";
import ViewUserChange from "~components/containers/view-user-change";

const InputLoginScreen: RootScreenProps<"InputNickname"> = ({ navigation }) => {
	const appDispatch = useAppDispatch();
	const resultCheckNickname = useAppSelector(store => {
		if (store.account.changeData.lastCheckNicknameAndResult === undefined) return false;
		return store.account.changeData.lastCheckNicknameAndResult[1];
	});
	const countBack = React.useRef<number>(0);

	const [variableNicknameList, setVariableNicknameList] = useState<string[]>([]);
	const NicknameBaseRef = useRef<ElementRef<typeof NicknameBase>>(null);

	const processing = async (checkedNickname: string, statusCheck: StatusCheck) => {
		switch (statusCheck) {
			case StatusCheck.USED:
				setVariableNicknameList(await generateNickname(checkedNickname));
				break;
			default:
				setVariableNicknameList([]);
				break;
		}
	};

	useFocusEffect(
		useCallback(() => {
			const user = auth().currentUser;
			if (!!user && !!user.displayName) {
				const convertedDisplayName = converterDisplayNameToNickname(user.displayName);
				if (convertedDisplayName) NicknameBaseRef.current?.editNickname(convertedDisplayName);
			}
		}, [])
	);

	useBackHandler(() => {
		if (countBack.current > 2) {
			if (Platform.OS === "android") {
				BackHandler.exitApp();
			}
			return true;
		} else {
			countBack.current += 1;
			setTimeout(() => {
				if (countBack.current > 0) countBack.current = 0;
			}, 1000);
			return true;
		}
	});
	// TODO need import animation and style
	return (
		<Screen backgroundColor={"#9765A8"}>
			<ViewUserChange>
				<NicknameBase
					ref={NicknameBaseRef}
					onEndChange={processing}
					checkValidateNickname={async (nickname: string) => {
						return (await appDispatch(actions.addChangedInformationUser({ nickname })).unwrap())
							.lastCheckNicknameAndResult?.[1] ?? false
							? StatusCheck.FREE
							: StatusCheck.USED;
					}}
					styleNicknameInputView={{}}
				/>
			</ViewUserChange>
			{variableNicknameList.length > 0 && (
				<View style={[styles.variableNicknameList]}>
					{variableNicknameList.map((item, index) => (
						<Pressable
							style={[styles.variableNicknameRow, index < variableNicknameList.length - 1 ? styles.separator : null]}
							key={index}
							onPress={() => {
								NicknameBaseRef.current?.editNickname(item);
							}}
						>
							<Text style={styles.variableNicknameText}>{item}</Text>
							<CheckMarkerGreen />
						</Pressable>
					))}
				</View>
			)}
			<ColorButton
				onPress={() => {
					navigation.navigate("InputImageAndBirthday");
				}}
				disabled={!resultCheckNickname}
				styleButton={{ marginTop: 9 }}
			>
				{i18n.t("continue")}
			</ColorButton>
			<Text style={styles.subText}>{i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}</Text>
		</Screen>
	);
};

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 30,
		paddingBottom: 75,
		justifyContent: "flex-start",
		flex: 1,
	},
	ColorButtonStyle: { marginVertical: 10 },
	subText: {
		fontSize: 13,
		lineHeight: 20,
		textAlign: "center",
		color: "#E7DDEC",
		marginTop: 4,
		...Tools.gStyle.font("400"),
	},
	variableNicknameList: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		marginTop: 9,
	},
	variableNicknameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 44,
		paddingHorizontal: 10,
	},
	variableNicknameText: {
		color: "#555555",
		fontSize: 13,
		lineHeight: 16,
		...Tools.gStyle.font("400"),
	},
	separator: {
		borderBottomWidth: 1,
		width: "100%",
		borderColor: "#C2A9CE",
	},
});

export default InputLoginScreen;
