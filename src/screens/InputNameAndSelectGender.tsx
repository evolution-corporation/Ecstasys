/** @format */

import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View, Pressable, Text, TextInput, Image, StyleSheet, Keyboard, Dimensions } from "react-native";
import { ColorButton, TextButton } from "~components/dump";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";
import gStyle from "~styles";
import { Gender, RootScreenProps } from "~types";
import auth from "@react-native-firebase/auth";

const InputNameAndSelectGender: RootScreenProps<"InputNameAndSelectGender"> = ({ navigation }) => {
	const [name, setName] = React.useState<string>("");
	const refTextInput = React.useRef<TextInput>(null);
	const [gender, setGender] = React.useState<Gender>(Gender.OTHER);
	const dispatch = useAppDispatch();
	const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		const keyboardListenOpen = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardOpen(true));
		const keyboardListenClose = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardOpen(false));
		return () => {
			keyboardListenOpen.remove();
			keyboardListenClose.remove();
		};
	}, []);

	const save = async () => {
		try {
			await dispatch(actions.updateAccount({ displayName: name, gender })).unwrap();
			navigation.goBack();
		} catch (error) {
			navigation.navigate("MessageLog", {
				message: error instanceof Error ? error.message : "Упс...",
				result: "Reject",
			});
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			const user = auth().currentUser;
			if (!!user && !!user.displayName) {
				setName(user.displayName);
			}
		}, [])
	);

	return (
		<View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}>
			<Pressable style={{ flexGrow: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }} onPress={() => navigation.goBack()} />
			<View style={{ position: "absolute", bottom: 0, width: "100%" }}>
				{Dimensions.get("window").height >= 800 ? (
					<Image
						source={require("assets/asdjkdsa.png")}
						style={{ alignSelf: "center", width: 249, height: 229, transform: [{ translateY: 1 }] }}
					/>
				) : null}

				<View
					style={{
						width: "100%",
						backgroundColor: "#FFF",
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						paddingHorizontal: 20,
						paddingVertical: 27,
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 20, ...gStyle.font("700"), textAlign: "center", color: "#3D3D3D" }}>
						{i18n.t("9c680da5-0b16-4861-8d16-a0a121dc3ed1")}
					</Text>
					<Text style={{ color: "rgba(64, 64, 64, 0.71)", fontSize: 14, ...gStyle.font("400"), marginTop: 11 }}>
						{i18n.t("0078afc8-9ad7-4b4f-8444-cb35110aba7b")}
					</Text>

					<TextInput
						style={{
							backgroundColor: "rgba(240, 242, 238, 0.19)",
							borderWidth: 1,
							borderColor: "#C2A9CE",
							width: "100%",
							height: 45,
							borderRadius: 15,
							marginTop: 14,
							marginBottom: 11,
							alignItems: "center",
							justifyContent: "center",
							color: "#9765A8",
							fontSize: 20,
							...gStyle.font("700"),
							textAlign: "center",
						}}
						onChangeText={setName}
						ref={refTextInput}
					/>
					{false ? null : (
						<>
							<Text style={{ color: "rgba(64, 64, 64, 0.71)", fontSize: 14, ...gStyle.font("400") }}>
								{i18n.t("053bda9d-5b61-47f8-b21e-56eec313d0cd")}
							</Text>
							<View style={{ flexDirection: "row", height: 163, width: "100%", marginTop: 13, marginBottom: 45 }}>
								<Pressable
									style={{ flex: 1, alignItems: "center" }}
									onPress={() => {
										setGender(Gender.MALE);
									}}
								>
									<Image source={require("assets/man.png")} style={{ flex: 1 }} resizeMode={"contain"} />
									<View style={[styles.generalButton, gender === Gender.MALE ? { backgroundColor: "#9765A8" } : null]}>
										<Text style={[styles.generalText, gender === Gender.MALE ? { color: "#FFF" } : null]}>
											{i18n.t("M")}
										</Text>
									</View>
								</Pressable>
								<View style={{ width: 38, height: "100%", justifyContent: "flex-end" }}>
									<Pressable
										style={[styles.generalButton, gender === Gender.OTHER ? { backgroundColor: "#9765A8" } : null]}
										onPress={() => {
											setGender(Gender.OTHER);
										}}
									>
										<View
											style={[
												{ backgroundColor: "#9765A8", width: 11, height: 1 },
												gender === Gender.OTHER ? { backgroundColor: "#FFF" } : null,
											]}
										/>
									</Pressable>
								</View>
								<Pressable
									style={{ flex: 1, alignItems: "center" }}
									onPress={() => {
										setGender(Gender.FEMALE);
									}}
								>
									<Image source={require("assets/fam.png")} style={{ flex: 1 }} resizeMode={"contain"} />
									<View
										style={[styles.generalButton, gender === Gender.FEMALE ? { backgroundColor: "#9765A8" } : null]}
									>
										<Text style={[styles.generalText, gender === Gender.FEMALE ? { color: "#FFF" } : null]}>
											{i18n.t("W")}
										</Text>
									</View>
								</Pressable>
							</View>
						</>
					)}
					<ColorButton
						styleText={{ color: "#FFF" }}
						styleButton={{ backgroundColor: "#C2A9CE", paddingHorizontal: 25, marginBottom: 20, borderRadius: 100 }}
						onPress={() => {
							save();
						}}
					>
						{i18n.t("save")}
					</ColorButton>
					<Pressable
						onPress={() => {
							dispatch(actions.setNotNewUser());
							navigation.goBack();
						}}
					>
						<Text style={{ fontSize: 14, opacity: 1, ...gStyle.font("400"), color: "#9765a8" }}>
							{i18n.t("9dca1ae3-981c-4c23-a38e-62d5eb7a23db")}
						</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	generalButton: {
		width: 38,
		height: 38,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#9765A8",
		borderWidth: 1,
		backgroundColor: "#FFF",
	},
	generalText: {
		fontSize: 14,
		...gStyle.font("400"),
		color: "#9765A8",
	},
});

export default InputNameAndSelectGender;
