import createColorSheet from "./create-color-sheet";
import createFontSheet from "./create-font-sheet";
import getFontOption, { FontStyle, FontWeight } from "./get-font-option";
import getShadows from "./get-shadows";
import sheet from "./sheet";
import useCustomFonts from "./use-custom-fonts";
import mixingFontStyle, { ParametersMixingFontStyle } from "./mixing-font-style";

global.GlobalStyleSheet = sheet();

export type StylesType = {
	FontStyle: FontStyle;
	FontWeight: FontWeight;
	ParametersMixingFontStyle: ParametersMixingFontStyle;
	sheet: ReturnType<typeof sheet>;
	mixingFontStyleParameters: Parameters<typeof mixingFontStyle>;
	useCustomFontsReturn: ReturnType<typeof useCustomFonts>;
};

export const getStyleSheetConstructors = {
	color: createColorSheet,
	font: createFontSheet,
};

export const getStyleValueConstructor = {
	fontFamily: getFontOption,
	shadows: getShadows,
};

export default { mixingFontStyle, useCustomFonts };
