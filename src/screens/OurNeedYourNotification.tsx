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

import * as Notifications from "expo-notifications";

const OurNeedYourNotification: RootScreenProps<"OurNeedYourNotification"> = ({ navigation, route }) => {
	const { window } = useDimensions();
	const widthModal = window.width - 50;

	const requestNotification = async () => {
		const { granted } = await Notifications.requestPermissionsAsync({ ios: { allowSound: true } });
		navigation.goBack();
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
				<HeaderText>Разрешение{"\n"}уведомлений</HeaderText>

				<DefaultText color="rgba(64, 64, 64, 0.71)" style={{ textAlign: "center" }}>
					Предоставь нам доступ к уведомлениям, чтобы мы могли уведомить о том, что медитация закончена и что пора
					сменить режим дыхания в сессии дмд
				</DefaultText>

				<ColorButton
					styleButton={{ backgroundColor: "#9765A8", paddingHorizontal: 25 }}
					styleText={{ color: "#FFF" }}
					onPress={() => requestNotification()}
				>
					Дать доступ
				</ColorButton>
				<TextButton styleText={{ color: "#9765A8" }} onPress={() => navigation.goBack()}>
					Назад
				</TextButton>
			</ViewPaddingList>
		</ScreenModal>
	);
};

export default OurNeedYourNotification;
