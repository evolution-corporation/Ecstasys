import translate, { IdTranslate } from "assets/translations";
import * as Localization from "expo-localization";
import i18nCustom from "./i18n-custom";

export type IdTranslateScope = IdTranslate | IdTranslate[];

console.log("create i18n");

const i18n = new i18nCustom(translate);
const supportLocale = Object.keys(translate);
i18n.locale = supportLocale.includes(Localization.locale) ? Localization.locale : supportLocale[0];
i18n.pluralization.register("ru-RU", (_i18n, count) => {
	const remainderOf10 = count % 10;
	const remainderOf100 = count % 100;
	let key;
	const zero = count === 0;
	const one = remainderOf10 === 1 && remainderOf100 !== 11;
	const few = [2, 3, 4].includes(remainderOf10) && ![12, 13, 14].includes(remainderOf100);
	const many =
		remainderOf10 === 0 || [5, 6, 7, 8, 9].includes(remainderOf10) || [11, 12, 13, 14].includes(remainderOf100);

	if (zero) {
		key = "zero";
	} else if (one) {
		key = "one";
	} else if (few) {
		key = "few";
	} else if (many) {
		key = "many";
	} else {
		key = "other";
	}
	return [key];
});

global.i18n = i18n;
export default i18n;
