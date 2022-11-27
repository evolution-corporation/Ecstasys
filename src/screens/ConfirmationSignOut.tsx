/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import { Pressable, View, Text } from "react-native";
import { ColorButton, TextButton } from "~components/dump";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";
import gStyle from "~styles";
import { RootScreenProps } from "~types";

const ConfirmationSignOut: RootScreenProps<"ConfirmationSignOut"> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { window } = useDimensions();
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
			<Pressable
				style={{
					width: window.width,
					height: window.height,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					position: "absolute",
				}}
				onPress={() => navigation.goBack()}
			/>
			<View
				style={{
					width: "100%",
					paddingBottom: 22,
					paddingHorizontal: 45,
					backgroundColor: "#FFF",
					borderRadius: 20,
					paddingTop: 47,
				}}
			>
				<Text style={{ ...gStyle.styles.SubTitle, color: "#3D3D3D" }}>
					{i18n.t("fc28e1fe-c700-4f9a-bb9f-3f54d9e2da8c")}
				</Text>
				<Text
					style={{
						width: "100%",
						color: "#404040",
						opacity: 0.71,
						...gStyle.font("400"),
						textAlign: "center",
						fontSize: 14,
						paddingTop: 24,
						paddingBottom: 17,
					}}
				>
					{i18n.t("02344de7-fd68-48e8-a1ff-0f5cf831e0c6")}
				</Text>

				<ColorButton
					onPress={() => dispatch(actions.signOutAccount())}
					styleText={{ color: "#FFF" }}
					styleButton={{ backgroundColor: "#C2A9CE", alignSelf: "center", paddingHorizontal: 25, marginBottom: 15 }}
				>
					{i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}
				</ColorButton>
				<TextButton onPress={() => navigation.goBack()}>{i18n.t("2ddcabd4-ad0a-4838-aa98-b32f23807b2d")}</TextButton>
			</View>
		</View>
	);
};

export default ConfirmationSignOut;
