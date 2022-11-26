/** @format */

import React from "react";
import { SafeAreaView, Text, StyleSheet, View, Pressable } from "react-native";
import i18n from "~i18n";
import { ColorButton } from "~components/dump";
import gStyle from "~styles";
import { RootScreenProps } from "~types";

const MessageLog: RootScreenProps<"MessageLog"> = ({ navigation, route }) => {
	const { message, result, title } = route.params;
	const onPress = () => {
		navigation.goBack();
	};
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
			<Pressable style={styles.backPress} onPress={onPress} />
			<View style={styles.container}>
				<Text style={styles.title}>
					{title ?? result === "Resolve"
						? i18n.t("37489393-4746-4521-a3d9-504210b65a05")
						: result === "Reject"
						? i18n.t("db8ad89b-5bbb-456d-95dd-58d415fc55cc")
						: result === "Loading"
						? i18n.t("b02ff859-ab2e-41bd-98e3-ad08575ac6f6")
						: result === "Info"
						? i18n.t("c3cbbc0e-ac71-4692-941e-6fa987a9e45d")
						: null}
				</Text>
				<Text style={styles.message}>{message}</Text>
				<ColorButton
					styleButton={{ backgroundColor: "#C2A9C3", paddingHorizontal: 40 }}
					styleText={{ color: "#FFFFFF" }}
					onPress={onPress}
				>
					{i18n.t("OK")}
				</ColorButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {},
	backPress: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "red",
	},
	container: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
		backgroundColor: "#FFFFFF",
		paddingVertical: 50,
		width: "100%",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 20,
		...gStyle.font("700"),
		color: "#3D3D3D",
		maxWidth: "50%",
		maxHeight: 46,
		textAlign: "center",
	},
	message: {
		fontSize: 14,
		...gStyle.font("400"),
		color: "#404040",
		opacity: 0.71,
		marginVertical: 30,
	},
});

export default MessageLog;
