/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import ScreenModal from "~components/containers/screen-modal";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import { ColorButton, TextButton } from "~components/dump";
import CloseCross from "~components/Elements/close-cross";
import CustomPartText from "~components/Text/custom-part-text";
import DefaultText from "~components/Text/default-text";
import HeaderText from "~components/Text/header-text";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";
import { RootScreenProps } from "~types";

const ConfirmationRemoveSubs: RootScreenProps<"ConfirmationRemoveSubs"> = ({ navigation }) => {
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
			<ViewPaddingList paddings={[47, 24, 17, 15, 22]} direction={Direction.Vertical}>
				<HeaderText color={"#3D3D3D"}>Вы действительно хотите отключить подписку?</HeaderText>
				<DefaultText color={"#404040"}>
					По окончанию срока действия подписки вы будет переведены на бесплатный тариф{" "}
					<CustomPartText fontWeight={"500"}>Base</CustomPartText>
				</DefaultText>
				<ColorButton
					onPress={() => {
						dispatch(actions.removeSubscribe());
						navigation.goBack();
					}}
					styleText={{ color: "#FFF" }}
					styleButton={{ backgroundColor: "#C2A9CE", alignSelf: "center", paddingHorizontal: 25 }}
				>
					Отключить
				</ColorButton>
			</ViewPaddingList>
		</ScreenModal>
	);
};

export default ConfirmationRemoveSubs;
