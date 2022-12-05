/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import { Pressable, View, Text } from "react-native";
import ScreenModal from "~components/containers/screen-modal";
import { ColorButton, TextButton } from "~components/dump";
import CloseCross from "~components/Elements/close-cross";
import ViewPadding from "~components/layouts/view-padding";
import DefaultText from "~components/Text/default-text";
import DescriptionText from "~components/Text/description-text";
import HeaderText from "~components/Text/header-text";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";
import gStyle from "~styles";
import { RootScreenProps } from "~types";

const distanceHeaderDefaultText = 24;
const distanceDefaultTextButton = 17;
const distanceButtonTextButton = 15;

const ConfirmationSignOut: RootScreenProps<"ConfirmationSignOut"> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { window } = useDimensions();
	const widthElements = window.width - 50;
	return (
		<ScreenModal
			styleContentBlock={{
				backgroundColor: "#FFF",
				borderRadius: 20,
				paddingHorizontal: 45,
				width: widthElements,
				minHeight: 280,
			}}
			styleNoContentElement={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<CloseCross />
			<ViewPadding top={47} bottom={distanceHeaderDefaultText / 2}>
				<HeaderText color={"#3D3D3D"}>{i18n.t("fc28e1fe-c700-4f9a-bb9f-3f54d9e2da8c")}</HeaderText>
			</ViewPadding>
			<ViewPadding top={distanceHeaderDefaultText / 2} bottom={distanceDefaultTextButton / 2}>
				<DefaultText color={"#404040"}>{i18n.t("02344de7-fd68-48e8-a1ff-0f5cf831e0c6")}</DefaultText>
			</ViewPadding>
			<ViewPadding top={distanceDefaultTextButton / 2} bottom={distanceButtonTextButton / 2}>
				<ColorButton
					onPress={() => dispatch(actions.signOutAccount())}
					styleText={{ color: "#FFF" }}
					styleButton={{ backgroundColor: "#C2A9CE", alignSelf: "center", paddingHorizontal: 25 }}
				>
					{i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}
				</ColorButton>
			</ViewPadding>
			<ViewPadding bottom={22} top={distanceButtonTextButton / 2}>
				<TextButton onPress={() => navigation.goBack()}>{i18n.t("2ddcabd4-ad0a-4838-aa98-b32f23807b2d")}</TextButton>
			</ViewPadding>
		</ScreenModal>
	);
};

export default ConfirmationSignOut;
