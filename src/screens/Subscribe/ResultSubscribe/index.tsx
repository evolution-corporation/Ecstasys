/** @format */

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ColorButton } from "~components/dump";

import Tools from "~core";

import Check from "./assets/Check.svg";
import i18n from "~i18n";
import { actions, useAppDispatch } from "~store";

const ResultSubscribeScreen = ({ route = { params: { status: "Edit" } }, navigation }) => {
	const { params } = route;
	const appDispatch = useAppDispatch();
	React.useEffect(() => {
		appDispatch(actions.getSubs());
	}, []);

	return (
		<View style={styles.background}>
			<View style={{ flex: 1 }} />
			<View style={styles.middleBlock}>
				<Check />
				<Text style={[styles.textTitle, { marginTop: 28 }]}>{i18n.t("ready")}!</Text>
				<Text style={[styles.textTitle, { marginTop: 30, marginBottom: 11 }]}>
					{i18n.t(
						params.status === "Designations"
							? "36665b8a-3801-4b54-928a-22d9291e279d"
							: params.status === "Edit"
							? "3c0d4097-a685-4141-9459-fdade7175b3b"
							: params.status === "Fail"
							? "348bcad7-3176-405d-94f7-3e88d6d6d939"
							: "274347f0-628b-4128-8595-d6be9611ea03"
					)}
					!
				</Text>
				<Text style={styles.textDescription}>
					{i18n.t(
						params.status === "Designations"
							? "cd6eba3d-0d93-4e46-bb3c-d809ee76b181"
							: params.status === "Edit"
							? "b952bec5-f5b6-439b-ab66-5e118673c19f"
							: params.status === "Fail"
							? "ab0de326-0612-451b-8f3d-b3bb894337f4"
							: "2b2951bd-0ee8-42c7-b37e-2a7059596b6a"
					)}
				</Text>
			</View>

			<View style={styles.bottomBlock}>
				<ColorButton
					styleText={styles.colorButtonText}
					styleButton={styles.colorButton}
					onPress={() => {
						navigation.navigate("TabNavigator");
					}}
				>
					{i18n.t("ready")}
				</ColorButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#9765A8",
		flex: 1,
	},
	middleBlock: { justifyContent: "center", alignItems: "center", flex: 1 },
	bottomBlock: { justifyContent: "center", flex: 1 },
	textTitle: {
		fontSize: 20,
		color: "#FFFFFF",
		...Tools.gStyle.font("700"),
	},
	textDescription: {
		color: "#E7DDEC",
		fontSize: 14,
		lineHeight: 17,
		width: "80%",
		maxWidth: Dimensions.get("screen").width - 40,
		textAlign: "center",
	},
	colorButtonText: {
		color: "#FFFFFF",
	},
	colorButton: {
		backgroundColor: "#702D87",
		minWidth: 100,
		alignSelf: "center",
	},
});

export default ResultSubscribeScreen;
