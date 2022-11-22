/** @format */

import React from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Keyboard } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import i18n from "~i18n";
import gStyle from "~styles";

import { ColorButton, SelectImageButton, NicknameInput } from "~components/dump";
import { Screen } from "~components/containers";
import { RootScreenProps } from "~types";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { StatusCheck } from "~components/dump/NicknameInput/NicknameBase";
import { Request } from "~api";
import { useDimensions } from "@react-native-community/hooks";

const EditUser: RootScreenProps<"EditUser"> = ({ navigation }) => {
	const changedData = useAppSelector(store => store.account.changeData);
	const { displayName, birthday, gender, image, nickName } = useAppSelector(store => {
		if (store.account.currentData === undefined) throw new Error("Not found user");
		return store.account.currentData;
	});
	const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);
	const dispatch = useAppDispatch();
	const update = async () => {
		try {
			await dispatch(actions.updateAccount({})).unwrap();
			navigation.navigate("MessageLog", {
				message: i18n.t("6962d75a-b6cc-4e30-aa87-addabf7450e7"),
				result: "Resolve",
			});
		} catch (error) {
			navigation.navigate("MessageLog", {
				message: error instanceof Error ? error.message : "Упс...",
				result: "Reject",
			});
		}
	};

	const { window } = useDimensions();

	React.useEffect(() => {
		const keyboardListenOpen = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardOpen(true));
		const keyboardListenClose = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardOpen(false));
		return () => {
			keyboardListenOpen.remove();
			keyboardListenClose.remove();
		};
	}, []);

	return (
		<Screen
			backgroundColor={"#9765A8"}
			styleScreen={{ justifyContent: "space-between", paddingBottom: isKeyboardOpen ? 5 : 79 }}
		>
			<View style={{ width: "100%", alignItems: "center" }}>
				{window.height <= 800 && isKeyboardOpen ? null : (
					<SelectImageButton
						style={styles.selectImage}
						onChangeImage={base64 => {
							if (base64) {
								dispatch(actions.addChangedInformationUser({ image: base64 }));
							}
						}}
						initImage={image}
					/>
				)}
				<TextInput
					style={styles.TextInputTransparent}
					key={"name"}
					placeholder={i18n.t("b89f2757-8b5e-4a08-b8f8-1bbe87834f3e")}
					placeholderTextColor={"rgba(231, 221, 236, 1)"}
					onChangeText={text => {
						dispatch(actions.addChangedInformationUser({ displayName: text }));
					}}
					defaultValue={changedData.displayName ?? displayName}
				/>
				<NicknameInput
					defaultValue={nickName}
					onEndChange={(inputNickName, status) => {
						if (status === StatusCheck.FREE) {
							Request.reservationNickname(inputNickName);
						}
					}}
					styleNicknameInputView={styles.editNickname}
					checkValidateNickname={async (inputNickName: string) => {
						if (nickName !== inputNickName) {
							return (await dispatch(actions.addChangedInformationUser({ nickname: inputNickName })).unwrap())
								.lastCheckNicknameAndResult?.[1] ?? false
								? StatusCheck.FREE
								: StatusCheck.USED;
						} else {
							return StatusCheck.AWAIT;
						}
					}}
				/>
				<TouchableOpacity
					style={styles.inputBirthday}
					onPress={() => {
						navigation.navigate("EditUserBirthday");
					}}
				>
					<Text style={styles.inputBirthdayText}>
						{i18n.strftime(
							changedData.birthday === undefined ? new Date(birthday) : new Date(changedData.birthday),
							"%d.%m.%Y"
						)}
					</Text>
					<EvilIcons name="pencil" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			</View>
			<ColorButton styleButton={styles.saveButton} styleText={styles.saveButtonText} onPress={update}>
				{i18n.t("save")}
			</ColorButton>
		</Screen>
	);
};

const styles = StyleSheet.create({
	// background: {
	// 	paddingHorizontal: 30,
	// 	justifyContent: "space-between",
	// 	paddingBottom: 80,
	// 	backgroundColor: "#9765A8",
	// 	flex: 1,
	// },

	TextInputTransparent: {
		color: "#FFFFFF",
		fontSize: 14,
		...gStyle.font("400"),
		paddingRight: 44,
		width: "100%",
		height: 45,
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 15,
		backgroundColor: "rgba(240, 242, 238, 0.19)",
		paddingHorizontal: 15,
		borderColor: "rgba(194, 169, 206, 1)",
		marginVertical: 7.5,
	},
	editNickname: {
		marginTop: 7.5,
	},
	inputDateBirthDay: {
		marginVertical: 7.5,
	},
	inputBirthday: {
		backgroundColor: "rgba(240, 242, 238, 0.19)",
		borderColor: "#C2A9CE",
		borderWidth: 1,
		borderRadius: 15,
		width: "100%",
		flexDirection: "row",
		height: 45,
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 14,
		paddingRight: 7,
	},
	buttonTextEditBirthday: {
		color: "#FFFFFF",
		textAlign: "left",
		flex: 1,
		marginLeft: 20,
	},
	saveButton: {
		backgroundColor: "#C2A9CE",
		borderRadius: 10,
	},
	saveButtonText: {
		color: "#FFFFFF",
	},
	selectImage: {
		height: 92,
		width: 92,
		borderRadius: 46,
		borderColor: "#FFFFFF",
		borderWidth: 3,
		backgroundColor: "#E7DDEC",
		marginVertical: 28,
	},
	inputBirthdayText: {
		color: "#FFFFFF",
		fontSize: 13,
		...gStyle.font("400"),
	},
});

export default EditUser;
