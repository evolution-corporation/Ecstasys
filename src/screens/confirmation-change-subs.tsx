/** @format */

import { useDimensions } from "@react-native-community/hooks";
import { StackActions } from "@react-navigation/native";
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

const ConfirmChangeSubs: RootScreenProps<"ConfirmChangeSubs"> = ({ navigation, route }) => {
	const { selectSubscribe } = route.params;
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
				<HeaderText color={"#3D3D3D"}>Вы действительно хотите изменить тарифный план?</HeaderText>
				<DefaultText color={"#404040"}>
					Списание произойдет автоматически после окончания действия текущего тарифного плана
				</DefaultText>
				<ColorButton
					onPress={() => navigation.dispatch(StackActions.replace("Payment", { selectSubscribe }))}
					styleText={{ color: "#FFF" }}
					styleButton={{ backgroundColor: "#C2A9CE", alignSelf: "center", paddingHorizontal: 25 }}
				>
					Изменить
				</ColorButton>
			</ViewPaddingList>
		</ScreenModal>
	);
};

export default ConfirmChangeSubs;
