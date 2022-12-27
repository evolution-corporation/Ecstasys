/** @format */
import React from "react";
import { View } from "react-native";
import { Instruction } from "src/api/types";
import CustomPartText from "~components/Text/custom-part-text";
import DefaultText from "~components/Text/default-text";
import HeaderText from "~components/Text/header-text";
import ViewPaddingList, { Direction } from "~components/containers/view-padding-list";

const InstructionPattern: React.FC<Instruction> = property => {
	const { title, description, data } = property;
	return (
		<ViewPaddingList paddings={[29.5, 28, 20]} direction={Direction.Vertical}>
			<HeaderText color={"#3D3D3D"}>{title}</HeaderText>
			<DefaultText
				color={"#9E9E9E"}
				style={{
					textAlign: "center",
				}}
			>
				{description}
			</DefaultText>
			<View style={{ width: 60, height: 2, backgroundColor: "#555555", alignSelf: "center" }} />
			{data.map((item, index) => (
				<DefaultText key={`key_${index}`} color={"#3D3D3D"}>
					<CustomPartText color={"#9765A8"} fontWeight="600">{`${index + 1}. `}</CustomPartText>
					{item.text}
				</DefaultText>
			))}
		</ViewPaddingList>
	);
};

export default InstructionPattern;
