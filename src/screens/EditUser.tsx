/** @format */

import React, { ElementRef } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Keyboard, Pressable, Modal } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import i18n from "~i18n";
import gStyle from "~styles";

import { ColorButton, SelectImageButton, NicknameInput } from "~components/dump";
import { CustomModal, Screen } from "~components/containers";
import { Gender, RootScreenProps } from "~types";
import { actions, useAppDispatch } from "~store";
import { StatusCheck } from "~components/dump/NicknameInput/NicknameBase";
import { Request } from "~api";
import { useDimensions } from "@react-native-community/hooks";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import TheArrow from "~assets/icons/TheArrow_WhiteTop.svg";
import useUserInformation from "src/hooks/use-user-information";

const EditUser: RootScreenProps<"EditUser"> = ({ navigation }) => {
	const customModalRef = React.useRef<ElementRef<typeof CustomModal>>(null);

	const closeList = () => {
		_RigthtBottomRadiusBackground.value = 15;
		_RotateArrow.value = "180deg";
		customModalRef.current?.close();
	};
	const { birthday, gender, image, isLoading, nickName, setValue, upload, displayName } = useUserInformation();
	const dispatch = useAppDispatch();

	const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);

	const { window } = useDimensions();

	const update = async () => {
		await upload();
	};

	React.useEffect(() => {
		const keyboardListenOpen = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardOpen(true));
		const keyboardListenClose = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardOpen(false));
		return () => {
			keyboardListenOpen.remove();
			keyboardListenClose.remove();
		};
	}, []);

	const _RigthtBottomRadiusBackground = useSharedValue(15);
	const _RotateArrow = useSharedValue("180deg");

	const backgroundAnimatedStyle = useAnimatedStyle(() => ({
		borderBottomRightRadius: withTiming(_RigthtBottomRadiusBackground.value),
	}));

	const arrowAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: withTiming(_RotateArrow.value) }],
	}));

	const openList = () => {
		_RigthtBottomRadiusBackground.value = 0;
		_RotateArrow.value = "0deg";
		customModalRef.current?.open();
	};

	const [ySelectGender, setYSelectGender] = React.useState<number | null>(null);

	const [widthSelectGender, setWidthSelectGender] = React.useState<number | null>(null);

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
								setValue({ image: base64 });
							}
						}}
						initImage={image}
					/>
				)}
				<Animated.View
					style={[
						{
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
						backgroundAnimatedStyle,
					]}
					onLayout={({ nativeEvent: { layout } }) => {
						setYSelectGender(layout.height + layout.y + 55);
					}}
				>
					{
						<TextInput
							style={styles.TextInputTransparent}
							key={"name"}
							placeholder={i18n.t("b89f2757-8b5e-4a08-b8f8-1bbe87834f3e")}
							placeholderTextColor={"rgba(231, 221, 236, 1)"}
							onChangeText={text => {
								setValue({ displayName: text });
							}}
							defaultValue={displayName}
						/>
					}
					<Pressable
						style={{
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
							borderLeftColor: "rgba(194, 169, 206, 1)",
							borderLeftWidth: 1,
							width: 120,
						}}
						onPress={() => openList()}
					>
						{
							<Text style={{ color: "#FFF", fontSize: 13, ...gStyle.font("400"), marginRight: 5 }}>
								{gender === "FEMALE"
									? i18n.t("83dfa634-dd9f-4dce-ab9e-6d6961a296f7")
									: gender === "MALE"
									? i18n.t("8d0002e2-5da2-448f-b9dc-e73352612c41")
									: i18n.t("7103289f-c425-457d-8b29-f9e0be60c01c")}
							</Text>
						}
						<Animated.View style={arrowAnimatedStyle}>
							<TheArrow />
						</Animated.View>
					</Pressable>
					<CustomModal ref={customModalRef} onClose={() => closeList()}>
						<View
							style={{
								backgroundColor: "#FFFFFF",
								borderBottomLeftRadius: 15,
								borderBottomRightRadius: 15,
								position: "absolute",
								top: ySelectGender ?? 0,
								width: 136,
								right: 20,
								paddingHorizontal: 20,
								paddingBottom: 10,
							}}
							onLayout={({ nativeEvent: { layout } }) => {
								if (widthSelectGender === null) {
									setWidthSelectGender(layout.width);
								}
							}}
						>
							{[
								{ translate: "83dfa634-dd9f-4dce-ab9e-6d6961a296f7", value: Gender.FEMALE },
								{ translate: "8d0002e2-5da2-448f-b9dc-e73352612c41", value: Gender.MALE },
								{ translate: "7103289f-c425-457d-8b29-f9e0be60c01c", value: Gender.OTHER },
							].map(item => (
								<Pressable
									style={{
										width: "100%",
										height: 35,
										justifyContent: "center",
										alignItems: "flex-start",
										marginTop: 15,
									}}
									key={item.value}
								>
									<Text
										style={{ opacity: 0.22, color: "#000000", fontSize: 13, textAlign: "left", ...gStyle.font("400") }}
										onPress={() => {
											closeList();
											setValue({ gender: item.value });
										}}
									>
										{i18n.t(item.translate)}
									</Text>
								</Pressable>
							))}
						</View>
					</CustomModal>
				</Animated.View>
				{
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
				}
				<TouchableOpacity
					style={[styles.inputBirthday, { marginTop: 15 }]}
					onPress={() => {
						navigation.navigate("EditUserBirthday");
					}}
				>
					<Text style={styles.inputBirthdayText}>{i18n.strftime(new Date(birthday), "%d.%m.%Y")}</Text>
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
		flex: 1,
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
