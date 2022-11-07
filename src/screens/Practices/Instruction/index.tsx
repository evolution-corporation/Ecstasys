/** @format */

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { RootScreenProps } from "~types";
import core from "~core";

const Instruction: RootScreenProps<"Instruction"> = ({ route }) => {
	const { body, description, id, title } = route.params.instruction;
	return (
		<ScrollView style={styles.background}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.description}>{description}</Text>
			<View style={styles.lineDescription} />
			{body.map((item, index) => (
				<Text key={`key_${index}`} style={styles.text}>
					<Text style={styles.indexKey}>{`${index + 1} `}</Text>
					{item.text}
				</Text>
			))}
		</ScrollView>
	);
};

export default Instruction;

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
	},
	title: {
		color: "#3D3D3D",
		fontSize: 24,
		...core.gStyle.font("700"),
		marginVertical: 20,
		textAlign: "center",
	},
	description: {
		color: "#9E9E9E",
		fontSize: 16,
		...core.gStyle.font("400"),
		lineHeight: 19,
		textAlign: "center",
	},
	lineDescription: {
		width: 60,
		height: 2,
		backgroundColor: "#555555",
		alignSelf: "center",
		marginTop: 20,
	},
	text: {
		color: "#3D3D3D",
		fontSize: 16,
		lineHeight: 21,
		...core.gStyle.font("600"),
		marginVertical: 10,
	},
	indexKey: { color: "#9765A8", ...core.gStyle.font("700") },
});
