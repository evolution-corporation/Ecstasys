/** @format */

import { StyleSheet } from "react-native";
import Colors from "./colors";

const location = StyleSheet.create({
	center: {
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	top: {
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	edges: {
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
	},
});

const margin = StyleSheet.create({
	mediumV: {
		marginVertical: 20,
	},
	mediumH: {
		marginHorizontal: 20,
	},
});

const colors = StyleSheet.create({
	darkLetters: {
		backgroundColor: Colors.DarkLetters,
	},
	noName1: {
		backgroundColor: Colors.noName1,
	},
	white: {
		backgroundColor: Colors.White,
	},
});

const temple = StyleSheet.create({
	feed: {
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		marginTop: -20,
	},
	card: {
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingBottom: 10,
		paddingTop: 15,
		justifyContent: "space-between",
		alignItems: "stretch",
	},
});

export default { location, margin, temple, ...colors };
