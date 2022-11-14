/** @format */
import i18n from "~i18n";

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import * as MailComposer from "expo-mail-composer";

import gStyles from "~styles";

import User from "assets/icons/User.svg";
import Mail from "assets/icons/Mail.svg";
import LogOut from "assets/icons/Log_Out.svg";
import { actions, useAppDispatch } from "~store";
import { RootScreenProps } from "~types";
import { StatusBar } from "expo-status-bar";

import { version } from "package.json";

const Options: RootScreenProps<"Options"> = ({ navigation }) => {
	const appDispatch = useAppDispatch();
	return (
		<View style={styles.background}>
			<StatusBar style="light" backgroundColor="#9765A8" hidden={false} />

			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					navigation.navigate("EditUser");
				}}
			>
				<User />
				<Text style={styles.buttonText}>{i18n.t("1c76bb73-8f7f-481e-8b76-475117f2b8c7")}</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					MailComposer.composeAsync({
						recipients: ["miner.hard00@gmail.com"],
						subject: i18n.t("d9d63e50-f4af-441d-ab8c-7df1ad8adda7"),
					});
				}}
			>
				<Mail />
				<Text style={styles.buttonText}>{i18n.t("6f272c11-bad7-4f80-9b99-cb59688942d0")}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					appDispatch(actions.signOutAccount());
				}}
			>
				<LogOut />
				<Text style={styles.buttonText}>{i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}</Text>
			</TouchableOpacity>
			<Text style={{ position: "absolute", bottom: 20, color: "#FFFFFF", right: 0 }}>{version}</Text>
		</View>
	);
};

export default Options;

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#9765A8",
		flex: 1,
		alignItems: "flex-start",
		paddingHorizontal: 20,
		justifyContent: "flex-start",
		paddingBottom: 30,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		height: 28,
		marginVertical: 12,
	},
	buttonText: {
		marginLeft: 34,
		color: "#FFFFFF",
		...gStyles.font("400"),
		fontSize: 15,
	},
});
