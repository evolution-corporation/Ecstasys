/** @format */

import React from "react";
import { ColorValue, View, Text, StyleSheet, ViewProps } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import i18n from "~i18n";

import Tools from "~core";

const StatisticsMeditation: React.FC<Props> = props => {
	const { style, colorR = "#9765A8", colorL = "#9765A8", count, time } = props;
	const minutes = Math.floor(time / 60000);
	return (
		<View style={[style, { flexDirection: "row" }]}>
			<View style={[styles.staticCardBackground, styles.staticCardBackgroundLeft, { borderColor: colorL }]}>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Feather name={"headphones"} size={40} color={colorL} />
					<Text style={[styles.staticCardText, { color: colorL }]}>
						{i18n.t("8f6752b0-6ada-4344-a0b9-dd471eee1297", {
							count: count,
						})}
					</Text>
				</View>
				<Text style={[styles.staticCardData, { color: colorL }]}>{count}</Text>
			</View>

			<View style={[styles.staticCardBackground, styles.staticCardBackgroundRight, { backgroundColor: colorR }]}>
				<View style={{ flex: 1, alignItems: "center" }}>
					<MaterialIcons name={"timer"} size={40} color={"#FFFFFF"} />
					<Text style={[styles.staticCardText, { color: "#FFFFFF" }]}>
						{i18n.t("dc1fa27d-9146-4a08-a241-7c10997eb654", {
							count: minutes,
						})}
					</Text>
				</View>
				<Text style={[styles.staticCardData, { color: "#FFFFFF" }]}>{minutes}</Text>
			</View>
		</View>
	);
};

interface Props extends ViewProps {
	colorR?: ColorValue;
	colorL?: ColorValue;
	count: number;
	time: number;
}

const styles = StyleSheet.create({
	staticCardBackground: {
		height: 100,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		borderRadius: 20,
		flex: 1,
	},
	staticCardBackgroundLeft: {
		borderColor: "#9765A8",
		backgroundColor: "#FFFFFF",
		borderWidth: 3,
		marginRight: 7.5,
	},
	staticCardBackgroundRight: {
		marginLeft: 7.5,
	},
	staticCardText: {
		lineHeight: 14,
		textAlign: "center",
		fontSize: 12,
		...Tools.gStyle.font("400"),
	},
	staticCardData: {
		fontSize: 32,
		...Tools.gStyle.font("700"),
		flex: 1,
		textAlign: "center",
		textAlignVertical: "center",
	},
	row: {
		transform: [{ rotateZ: "180deg" }, { scale: 1.7 }],
		alignSelf: "center",
	},
});

export default StatisticsMeditation;
