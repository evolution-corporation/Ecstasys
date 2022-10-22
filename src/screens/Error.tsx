/** @format */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import core from "~core";
import { RootScreenProps } from "~types";
import i18n from "~i18n";

const ErrorScreen: RootScreenProps<"Error"> = ({ navigation, route }) => {
	const { message } = route.params;
	return (
		<View style={styles.container}>
			<View style={styles.messageContainer}>
				<Text style={styles.title}>{i18n.t("c23d733a-3af7-440d-920b-bbb961ea7776")}</Text>
				<Text style={styles.message}>{message}</Text>
			</View>
		</View>
	);
};

ErrorScreen.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#9765A8",
	},
	messageContainer: {
		backgroundColor: "#FFFFFF",
		padding: 20,
		width: "40%",
		justifyContent: "center",
		alignItems: "center",
	},
	message: {
		fontSize: 20,
		...core.gStyle.font("800"),
		color: "#3D3D3D",
	},
	title: {
		fontSize: 14,
		...core.gStyle.font("400"),
		color: "#3D3D3D",
	},
});

export default ErrorScreen;
