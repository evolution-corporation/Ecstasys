import { I18n } from "i18n-js";
import translate from "./translations";
import * as Localization from "expo-localization";
import CodeCountry from "./CodeCountry";

const i18n = new I18n(translate);
const supportLocale = Object.keys(translate);

i18n.locale = supportLocale.includes(Localization.locale)
  ? Localization.locale
  : supportLocale[0];

i18n.pluralization.register("ru-RU", (_i18n, count) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let key;
  const zero = count === 0;
  const one = mod10 === 1 && mod100 !== 11;
  const few = [2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100);
  const many =
    mod10 === 0 ||
    [5, 6, 7, 8, 9].includes(mod10) ||
    [11, 12, 13, 14].includes(mod100);

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

export default i18n;

export function getCountryList(): { [index: string]: string } {
  return Object.fromEntries(
    CodeCountry.map((codeCountry) => [codeCountry, getCountryName(codeCountry)])
  );
}

export function getCountryName(code: string): string {
  return i18n.t(code);
}
