import { StyleSheet } from "react-native";

import CreateColorSheet from "./create-color-sheet";
import CreateFontSheet from "./create-font-sheet";

console.log("create table");

const Sheet = StyleSheet.create({
	...CreateColorSheet(),
	...CreateFontSheet(),
});

export default () => Sheet;
