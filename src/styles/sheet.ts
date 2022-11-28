import { StyleSheet, TextStyle } from "react-native";

import CreateColorSheet from "./create-color-sheet";
import CreateFontSheet from "./create-font-sheet";

const Sheet = StyleSheet.create({
	...CreateColorSheet(),
	...CreateFontSheet(),
});

global.GlobalStyle.Sheet = Sheet;

export default () => Sheet;
