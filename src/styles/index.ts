import createColorSheet from "./create-color-sheet";
import createFontSheet from "./create-font-sheet";
import getFontOption from "./get-font-option";
import getShadows from "./get-shadows";
import sheet from "./sheet";
import mixingFontStyle from "./mixing-font-style";
import Colors from "config/colors.json";
import Fonts from "config/fonts.json";
import useCustomFonts from "./use-custom-fonts";

export type { FontStyle, FontWeight } from "./get-font-option";
export type { ParametersMixingFontStyle } from "./mixing-font-style";

global.GlobalStyleSheet = sheet();
type Sheet = ReturnType<typeof sheet>;
type MixingFontStyleParameters = Parameters<typeof mixingFontStyle>;
type UseCustomFontsReturn = ReturnType<typeof useCustomFonts>;
type ColorName = keyof typeof Colors;
type FontName = keyof typeof Fonts;

export type { Sheet, MixingFontStyleParameters, UseCustomFontsReturn, ColorName, FontName };

export const getStyleSheetConstructors = {
	color: createColorSheet,
	font: createFontSheet,
};

export const getStyleValueConstructor = {
	fontFamily: getFontOption,
	shadows: getShadows,
};

export { colorNameInclude, getNameStyleForLayout, getNameStyleForText } from "./create-color-sheet";
export { default as useCustomFonts } from "./use-custom-fonts";
export { default as mixingFontStyle } from "./mixing-font-style";
