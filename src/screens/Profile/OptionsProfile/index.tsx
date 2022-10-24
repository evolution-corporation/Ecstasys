/** @format */
import i18n from "~i18n";

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { FontAwesome5 } from "@expo/vector-icons";

import core from "~core";

import User from "./assets/User.svg";
import Mail from "./assets/Mail.svg";
import LogOut from "./assets/Log_Out.svg";

const OptionsProfile: RootScreenProps<"OptionsProfile"> = ({ navigation }) => {
	const { func } = useUserContext();

	return (
		<View style={styles.background}>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					navigation.navigate("EditUserData");
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
			{__DEV__ ? (
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						navigation.navigate("devSetting");
					}}
				>
					<FontAwesome5 name="dev" size={24} color="#FFFFFF" />
					<Text style={styles.buttonText}>{i18n.t("ef4acf5c-debd-4fae-a06d-bef7632faae1")}</Text>
				</TouchableOpacity>
			) : null}
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					func.signOut();
				}}
			>
				<LogOut />
				<Text style={styles.buttonText}>{i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default OptionsProfile;

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
		...core.gStyle.font("400"),
		fontSize: 15,
	},
});
