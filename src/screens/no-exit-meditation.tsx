/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import { Image } from "react-native";
import CloseCross from "~components/Elements/close-cross";
import DefaultText from "~components/Text/default-text";
import HeaderText from "~components/Text/header-text";
import ScreenModal from "~components/containers/screen-modal";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";
import { ColorButton, TextButton } from "~components/dump";
import { PracticesMeditation, RootScreenProps } from "~types";

const NoExitMeditation: RootScreenProps<"NoExitMeditation"> = ({ navigation, route }) => {
	const { window } = useDimensions();
	const widthModal = window.width - 50;

	const removeLastScreen = () => {
		navigation.pop(2);
		// const navigationState = navigation.getState();
		// const lastScreen = navigationState.routes[navigationState.routes.length - 3];
		// console.log(lastScreen.name);
		// navigation.navigate("PracticeListByType", { typePractices: PracticesMeditation.BASIC });
	};

	return (
		<ScreenModal
			styleContentBlock={{
				backgroundColor: "#FFF",
				borderRadius: 20,
				alignItems: "center",
				paddingHorizontal: 39,
				width: widthModal,
			}}
			styleNoContentElement={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<CloseCross />

			<ViewPaddingList direction={Direction.Vertical} paddings={[47, 15, 12, 12, 15, 30]}>
				<HeaderText>Выйти из медитации</HeaderText>

				<DefaultText color="rgba(64, 64, 64, 0.71)" style={{ textAlign: "center" }}>
					Хочешь завершить медитацию, раньше окончания?
				</DefaultText>
				<Image
					source={require("assets/Визуализация1.png")}
					style={{ width: widthModal, height: (widthModal / 335) * 264 }}
					resizeMode={"contain"}
				/>

				<ColorButton
					styleButton={{ backgroundColor: "#C2A9CE", paddingHorizontal: 25 }}
					styleText={{ color: "#FFF" }}
					onPress={() => {
						navigation.goBack();
					}}
				>
					Остаться
				</ColorButton>
				<TextButton styleText={{ color: "#9765A8" }} onPress={() => removeLastScreen()}>
					Завершить
				</TextButton>
			</ViewPaddingList>
		</ScreenModal>
	);
};

export default NoExitMeditation;
