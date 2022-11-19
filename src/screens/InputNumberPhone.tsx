/** @format */

import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import { ColorButton, NumberInput } from "~components/dump";
import { Screen } from "~components/containers";
import i18n from "~i18n";

import type { RootScreenProps } from "~types";

const NumberInputScreen: RootScreenProps<"InputNumberPhone"> = ({ navigation }) => {
	const NumberPhone = useRef<{ numberPhone: string; isValidate: boolean }>({
		numberPhone: "",
		isValidate: false,
	});
	const headerHeight = useHeaderHeight();

	const requestSMSCode = async () => {
		if (NumberPhone.current.isValidate && !!NumberPhone.current.numberPhone) {
			navigation.navigate("InputSMSCode", {
				phoneNumber: NumberPhone.current.numberPhone,
			});
		}
	};
	return (
		<Screen backgroundColor={"#9765A8"} styleScreen={{ paddingTop: 9 }}>
			<NumberInput
				onChange={(numberPhone: string, isValidate: boolean) => {
					NumberPhone.current = { numberPhone, isValidate };
				}}
				fixHeigth={headerHeight}
			/>
			<ColorButton styleButton={styles.colorButton} onPress={requestSMSCode}>
				{i18n.t("continue")}
			</ColorButton>
		</Screen>
	);
};

export default NumberInputScreen;

const styles = StyleSheet.create({
	background: {
		paddingTop: 54 + 9,
	},
	colorButton: {
		marginTop: 14,
	},
});
