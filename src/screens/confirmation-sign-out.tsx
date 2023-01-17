/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import ScreenModal from "~components/containers/screen-modal";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import { ColorButton, TextButton } from "~components/dump";
import CloseCross from "~components/Elements/close-cross";
import DefaultText from "~components/Text/default-text";
import HeaderText from "~components/Text/header-text";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";
import { RootScreenProps } from "~types";

const ConfirmationSignOut: RootScreenProps<"ConfirmationSignOut"> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { window } = useDimensions();
	const widthElements = window.width - 50;
	const exit = () => {
		dispatch(actions.signOutAccount());
	}

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
			<ViewPaddingList paddings={[47, 24, 17, 15, 22]} direction={Direction.Vertical}>
				<HeaderText color={"#3D3D3D"}>{i18n.t("fc28e1fe-c700-4f9a-bb9f-3f54d9e2da8c")}</HeaderText>
				<DefaultText color={"#404040"} style={{ textAlign: "center" }}>
					{i18n.t("02344de7-fd68-48e8-a1ff-0f5cf831e0c6")}
				</DefaultText>
				<ColorButton
					onPress={() => exit()}
					styleText={{ color: "#FFF" }}
					styleButton={{ backgroundColor: "#C2A9CE", alignSelf: "center", paddingHorizontal: 25 }}
				>
					{i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}
				</ColorButton>
				<TextButton onPress={() => navigation.goBack()}>{i18n.t("2ddcabd4-ad0a-4838-aa98-b32f23807b2d")}</TextButton>
			</ViewPaddingList>
		</ScreenModal>
	);
};

export default ConfirmationSignOut;
