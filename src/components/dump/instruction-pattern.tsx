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
			<>
				{data.map((item, index) => {
					const text: { text: string; isBold: boolean }[] = [];
					if (item.text.includes("<b>")) {
						let noParserString = item.text.replaceAll("<b>", "<>").replaceAll("</b>", "</>");
						const noBoldString = noParserString.replace(/<>[\s\S]*?<\/>/g, "^").split("^");
						const boldString =
							noParserString.match(/<>[\s\S]*?<\/>/g)?.map(item => item.replace(/(<>|<\/>)/g, "")) ?? [];
						let heap = [
							...noBoldString.map(text => ({ text, isBold: false })),
							...boldString.map(text => ({ text, isBold: true })),
						];
						noParserString = noParserString.replace(/(<>|<\/>)/g, "");
						while (heap.length > 0) {
							for (let i = 0; i <= heap.length; i++) {
								const element = heap[i];
								if (noParserString.indexOf(element.text) === 0) {
									text.push(element);
									heap = [...heap.filter((_, index) => index !== i)];
									noParserString = noParserString.slice(element.text.length);
									break;
								}
							}
						}
					} else {
						text.push({ text: item.text, isBold: false });
					}
					return (
						<DefaultText key={`key_${index}`} color={"#3D3D3D"}>
							<CustomPartText color={"#9765A8"} fontWeight="600">{`${index + 1}. `}</CustomPartText>
							<>
								{text.map((item, index) => (
									<CustomPartText key={index} fontWeight={item.isBold ? "700" : "400"}>
										{item.text}
									</CustomPartText>
								))}
							</>
						</DefaultText>
					);
				})}
			</>
		</ViewPaddingList>
	);
};

export default InstructionPattern;
