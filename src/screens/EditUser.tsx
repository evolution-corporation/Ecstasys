/** @format */

import React, { useRef } from "react";
import { StyleSheet, TextInput, View, Keyboard, Pressable } from "react-native";
import i18n from "~i18n";
import gStyle from "~styles";

import { ColorButton, SelectImageButton, NicknameInput, NumberInput } from "~components/dump";
import { Screen } from "~components/containers";
import { Gender, RootScreenProps } from "~types";
import { actions, useAppDispatch } from "~store";
import { StatusCheck } from "~components/dump/NicknameInput/nickname-base";
import { Request } from "~api";
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import useUserInformation from "src/hooks/use-user-information";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import WithDropList from "~components/containers/with-drop-list";
import DefaultText from "~components/Text/default-text";
import ViewUserChange from "~components/containers/view-user-change";

const SelectWithDropList = WithDropList<Gender>();

const EditUser: RootScreenProps<"EditUser"> = ({ navigation }) => {
	const { birthday, gender, image, nickName, setValue, upload, displayName, isHaveImage } = useUserInformation();
	const nameSelectedGender =
		gender === "FEMALE"
			? i18n.t("83dfa634-dd9f-4dce-ab9e-6d6961a296f7")
			: gender === "MALE"
			? i18n.t("8d0002e2-5da2-448f-b9dc-e73352612c41")
			: i18n.t("7103289f-c425-457d-8b29-f9e0be60c01c");

	const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);

	const update = async () => {
		try {
			await upload();
			navigation.navigate("MessageLog", {
				message: i18n.t("6962d75a-b6cc-4e30-aa87-addabf7450e7"),
				result: "Resolve",
			});
		} catch (error) {
			console.log(error);
			navigation.navigate("MessageLog", {
				message: !!error.message ? error.message : "Упс...",
				result: "Reject",
			});
		}
	};

	const borderBottomRightRadiusSelectGender = useSharedValue(20);

	const animatedStyleSelectGender = useAnimatedStyle(() => ({
		borderBottomRightRadius: withTiming(borderBottomRightRadiusSelectGender.value),
	}));
	const appDispatch = useAppDispatch();
	React.useEffect(() => {
		const keyboardListenOpen = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardOpen(true));
		const keyboardListenClose = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardOpen(false));
		return () => {
			keyboardListenOpen.remove();
			keyboardListenClose.remove();
		};
	}, []);
	const referenceSelectImage = useRef<React.ElementRef<typeof SelectImageButton>>(null);
	return (
		<Screen
			backgroundColor={"#9765A8"}
			styleScreen={{ justifyContent: "space-between", paddingBottom: isKeyboardOpen ? 5 : 79 }}
		>
			<View>
				<ViewPaddingList direction={Direction.Vertical} paddings={[28, 17, 17, 15]}>
					<SelectImageButton
						ref={referenceSelectImage}
						style={{ alignSelf: "center" }}
						onChangeImage={base64 => {
							if (base64) {
								setValue({ image: base64 });
							}
						}}
						initImage={image}
					/>
					{isHaveImage ? (
						<Pressable
							onPress={() => {
								setValue({ image: null });
								referenceSelectImage.current?.removeImage();
							}}
						>
							<DefaultText color={"#C2A9CE"} style={{ alignSelf: "center" }}>
								{i18n.t("634c0283-1657-42ca-b25a-482dd5c7f439")}
							</DefaultText>
						</Pressable>
					) : (
						<View style={{ height: 16 }} />
					)}

					<ViewUserChange animatedStyle={animatedStyleSelectGender}>
						<TextInput
							placeholder={i18n.t("b89f2757-8b5e-4a08-b8f8-1bbe87834f3e")}
							placeholderTextColor={"rgba(231, 221, 236, 1)"}
							style={{
								height: "100%",
								flex: 1,
								color: "#FFF",
								...gStyle.styles.default,
							}}
							defaultValue={displayName}
							onChangeText={text => {
								setValue({ displayName: text });
							}}
						/>
						<SelectWithDropList
							contentDopList={[
								{ name: i18n.t("83dfa634-dd9f-4dce-ab9e-6d6961a296f7"), value: Gender.FEMALE },
								{ name: i18n.t("8d0002e2-5da2-448f-b9dc-e73352612c41"), value: Gender.MALE },
								{ name: i18n.t("7103289f-c425-457d-8b29-f9e0be60c01c"), value: Gender.OTHER },
							]}
							onChange={selectedGender => {
								setValue({ gender: selectedGender });
							}}
							rightBorderDropList={-15}
							onClose={() => {
								borderBottomRightRadiusSelectGender.value = 20;
							}}
							onOpen={() => {
								borderBottomRightRadiusSelectGender.value = 0;
							}}
							style={{ borderLeftWidth: 1, borderLeftColor: "#C2A9CE" }}
						>
							<DefaultText color={"#FFF"}>{nameSelectedGender}</DefaultText>
						</SelectWithDropList>
					</ViewUserChange>
					<NicknameInput
						defaultValue={nickName}
						onEndChange={(inputNickName, status) => {
							if (status === StatusCheck.FREE) {
								Request.reservationNickname(inputNickName);
							}
						}}
						// styleNicknameInputView={{}}
						checkValidateNickname={async (inputNickName: string) => {
							if (nickName !== inputNickName) {
								return (await appDispatch(actions.addChangedInformationUser({ nickname: inputNickName })).unwrap())
									.lastCheckNicknameAndResult?.[1] ?? false
									? StatusCheck.FREE
									: StatusCheck.USED;
							} else {
								return StatusCheck.AWAIT;
							}
						}}
					/>
					<Pressable onPress={() => navigation.navigate("EditUserBirthday")}>
						<ViewUserChange>
							<DefaultText color={"#FFF"}>{i18n.strftime(new Date(birthday), "%d.%m.%Y")}</DefaultText>
						</ViewUserChange>
					</Pressable>
				</ViewPaddingList>
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
