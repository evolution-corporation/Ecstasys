import { I18n, TranslateOptions } from "i18n-js";
import { IdTranslate } from "assets/translations";

export type IdTranslateScope = IdTranslate | IdTranslate[];

console.log("create i18n");

export default class extends I18n {
	public translation(scope: IdTranslateScope, options?: TranslateOptions) {
		return this.t(scope, options);
	}
}
