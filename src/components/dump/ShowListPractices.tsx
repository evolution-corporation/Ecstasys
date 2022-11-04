/** @format */

import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ViewProps, Image } from "react-native";
import { Practice } from "src/models";
import core from "~core";
import { State } from "~types";

interface Props extends ViewProps {
	historyPractices: State.Practice[];
	onPress?: (practice: State.Practice) => void;
}

const ShowListPractices: React.FC<Props> = props => {
	const { historyPractices, onPress } = props;
	return (
		<FlatList
			data={historyPractices}
			renderItem={({ item }) => (
				<Pressable
					onPress={() => {
						if (onPress) onPress(item);
					}}
				>
					<Image source={{ uri: item.image }} style={styles.image} />
					<Text style={styles.name}>{item.name}</Text>
				</Pressable>
			)}
			ItemSeparatorComponent={() => <View style={styles.separator} />}
			horizontal
			showsHorizontalScrollIndicator={false}
		/>
	);
};

ShowListPractices.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	image: {
		width: 140,
		height: 183,
		borderRadius: 20,
		...core.gStyle.shadows(2, 3),
	},
	name: {
		marginTop: 4,
		fontSize: 16,
		color: "#3D3D3D",
		...core.gStyle.font("600"),
	},
	separator: {
		width: 27,
		height: "100%",
	},
});

export default ShowListPractices;
