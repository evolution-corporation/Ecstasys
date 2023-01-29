/** @format */

import React, {useEffect} from "react";
import {View, ScrollView, ActivityIndicator} from "react-native";

import { RootScreenProps } from "~types";
import { Screen } from "~components/containers";

import { ColorButton } from "~components/dump";
import InstructionPattern from "~components/dump/instruction-pattern";
import {getInstructionMeditationById } from "../../../api/requests";

const Instruction: RootScreenProps<"Instruction"> = ({ route, navigation }) => {
	const { meditationid, instruction } = route.params
	const { body, description, title } = instruction;
	const [isLoading, setIsLoading] = React.useState<boolean>(meditationid !== undefined)
	const [data, setData] = React.useState({ body, description, title })

	useEffect(() => {
		if (meditationid !== undefined) {
			getInstructionMeditationById(meditationid).then((r) => {
				if (r !== null) {
					console.log(r)
					setData({
						title: r.Title,
						body: r.Body.map(i => ({ text: i })),
						description: r.Description
					})
					setIsLoading(false)
				}

			})
		}
	}, [meditationid])

	return (
		<Screen backgroundColor={"#9765A8"} paddingHorizontalOff>
			<ScrollView style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
				{
					isLoading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={"#C2A9CE"}/></View>
						: <InstructionPattern data={data.body} description={data.description} title={data.title} />
				}
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
