/** @format */

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { RootScreenProps } from "~types";
import core from "~core";
import { Screen } from "~components/containers";

import { ColorButton } from "~components/dump";
import InstructionPattern from "~components/dump/instruction-pattern";

const Instruction: RootScreenProps<"Instruction"> = ({ route, navigation }) => {
	const { body, description, id, title } = route.params.instruction;
	return (
		<Screen backgroundColor={"#9765A8"} paddingHorizontalOff>
			<ScrollView style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
				<InstructionPattern data={body} description={description} title={title} />
				<ColorButton
					onPress={() => {
						navigation.goBack();
					}}
					styleButton={{ backgroundColor: "#C2A9CE", marginBottom: 50 }}
					styleText={{ color: "#FFFFFF" }}
				>
					К практике
				</ColorButton>
			</ScrollView>
		</Screen>
	);
};

export default Instruction;
