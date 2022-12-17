/** @format */

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { RootScreenProps } from "~types";
import core from "~core";
import { Screen } from "~components/containers";
import HeaderText from "~components/Text/header-text";
import DefaultText from "~components/Text/default-text";
import CustomPartText from "~components/Text/custom-part-text";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";

const Instruction: RootScreenProps<"Instruction"> = ({ route }) => {
	const { body, description, id, title } = route.params.instruction;
	return (
		<Screen backgroundColor={"#9765A8"} paddingHorizontalOff>
			<ScrollView style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
				<ViewPaddingList paddings={[29.5, 28, 20]} direction={Direction.Vertical}>
					<HeaderText color={"#3D3D3D"}>{title}</HeaderText>
					<DefaultText color={"#9E9E9E"} style={{ textAlign: "center" }}>
						{description}
					</DefaultText>
					<View style={styles.lineDescription} />
					{body.map((item, index) => (
						<DefaultText key={`key_${index}`} color={"#3D3D3D"}>
							<CustomPartText color={"#9765A8"} fontWeight="600">{`${index + 1}. `}</CustomPartText>
							{item.text}
						</DefaultText>
					))}
				</ViewPaddingList>
			</ScrollView>
		</Screen>
	);
};

export default Instruction;

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 20,
		backgroundColor: "#FFFFFF",
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
