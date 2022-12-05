/** @format */

import React from "react";
import { Image } from "react-native";
import i18n from "~i18n";
import { RootScreenProps } from "~types";
import { ColorButton } from "~components/dump";
import ScreenModal from "~components/containers/screen-modal";
import { useDimensions } from "@react-native-community/hooks";
import CloseCross from "~components/Elements/close-cross";
import HeaderText from "~components/Text/header-text";
import DefaultText from "~components/Text/default-text";
import DescriptionText, { TextAlign } from "~components/Text/description-text";
import CustomPartText from "~components/Text/custom-part-text";
import ViewPadding from "~components/layouts/view-padding";

const distanceHeaderDefaultText = 26;
const distanceDefaultTextImage = 19;
const distanceImagePrice = 19;
const distancePriceButton = 34;

const ByMaySubscribe: RootScreenProps<"ByMaySubscribe"> = ({ navigation }) => {
	const { window } = useDimensions();
	return (
		<ScreenModal
			styleContentBlock={{
				backgroundColor: "#FFF",
				borderRadius: 20,
				alignItems: "center",
				paddingHorizontal: 39,
				width: window.width - 50,
			}}
			styleNoContentElement={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<CloseCross />
			<ViewPadding top={45} bottom={distanceHeaderDefaultText / 2}>
				<HeaderText>{i18n.t("c6422cd6-c99d-4bbb-a537-238e5e751c01")}</HeaderText>
			</ViewPadding>
			<ViewPadding top={distanceHeaderDefaultText / 2} bottom={distanceDefaultTextImage / 2}>
				<DefaultText color="rgba(64, 64, 64, 0.71)" style={{ textAlign: "center" }}>
					{i18n.t("e505cf76-d64a-4152-86b0-f81b41c9035f")}
				</DefaultText>
			</ViewPadding>
			<ViewPadding top={distanceDefaultTextImage / 2} bottom={distanceImagePrice / 2}>
				<Image source={require("assets/sofaMan.png")} style={{ height: 90, width: 138 }} resizeMode={"center"} />
			</ViewPadding>
			<ViewPadding top={distanceImagePrice / 2} bottom={distancePriceButton / 2}>
				<DescriptionText color={"#9765A8"} textAlign={TextAlign.Center}>
					<CustomPartText fontWeight="500">{i18n.t("e9abbcbe-6d0b-46b6-a777-dc3e73a3dbac")}</CustomPartText>
					{i18n.t("3d2b0890-e1e2-4abe-9fa1-a2bc531e38b6")}
				</DescriptionText>
			</ViewPadding>
			<ViewPadding top={distancePriceButton / 2} bottom={30}>
				<ColorButton
					styleButton={{ backgroundColor: "#C2A9CE", paddingHorizontal: 25, borderRadius: 100 }}
					styleText={{ color: "#FFF" }}
					onPress={() => {
						navigation.navigate("SelectSubscribe");
					}}
				>
					{i18n.t("Arrange")}
				</ColorButton>
			</ViewPadding>
		</ScreenModal>
	);
};

export default ByMaySubscribe;
