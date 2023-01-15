/** @format */

import React from "react";
import { FlatList, Switch, View } from "react-native";
import useExperimentalFunction from "src/hooks/use-experimental-function";
import { NameExperimentalFunction } from "src/store/reducers/experimental-config";
import CloseCross from "~components/Elements/close-cross";
import DefaultText from "~components/Text/default-text";
import ScreenModal from "~components/containers/screen-modal";
import { useAppSelector } from "~store";
import { RootScreenProps } from "~types";

const ExperimentalConfig: RootScreenProps<"ExperimentalConfig"> = () => {
	const experimentalFunctions = useAppSelector(
		store => Object.keys(store.ExperimentalConfig) as NameExperimentalFunction[]
	);

	const experimentalFunctionsController = Object.fromEntries(
		experimentalFunctions.map(name => [name, useExperimentalFunction(name)])
	);

	return (
		<ScreenModal
			styleContentBlock={{
				backgroundColor: "#FFF",
				borderRadius: 20,
				alignItems: "center",
				paddingHorizontal: 20,
				paddingVertical: 39,
				width: "95%",
			}}
			styleNoContentElement={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<CloseCross />
			<FlatList
				data={experimentalFunctions}
				style={{ width: "100%" }}
				renderItem={({ item }) => (
					<View
						style={{
							width: "100%",
							height: 50,
							justifyContent: "space-between",

							alignItems: "center",
							flexDirection: "row",
						}}
					>
						<DefaultText>{item}</DefaultText>
						<Switch
							value={experimentalFunctionsController[item].status}
							onChange={({ nativeEvent: { value } }) => {
								if (value) {
									experimentalFunctionsController[item].enable();
								} else {
									experimentalFunctionsController[item].disable();
								}
							}}
						/>
					</View>
				)}
			/>
		</ScreenModal>
	);
};

export default ExperimentalConfig;
