/** @format */

import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import { ColorButton } from "~components/dump";
import Tools from "~core";
import i18n from "~i18n";

import { NumberInput } from "./components";
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
		<View style={styles.background}>
			<NumberInput
				onChange={(numberPhone: string, isValidate: boolean) => {
					NumberPhone.current = { numberPhone, isValidate };
				}}
				fixHeigth={headerHeight}
			/>
			<ColorButton styleButton={styles.colorButton} onPress={requestSMSCode}>
				{i18n.t("continue")}
			</ColorButton>
		</View>
	);
};

export default NumberInputScreen;

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
		backgroundColor: "#9765A8",
		flex: 1,
	},
	colorButton: {
		marginTop: 14,
	},
});
