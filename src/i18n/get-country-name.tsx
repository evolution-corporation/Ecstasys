import CodeCountry from "./code-country";

export const getCountryName = (code: string): string => {
	return global.i18n.t(code);
};

export const getCountryList = (): { [index: string]: string } => {
	return Object.fromEntries(CodeCountry.map(codeCountry => [codeCountry, getCountryName(codeCountry)]));
};
