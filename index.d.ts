/** @format */

declare module "*.svg" {
	import React from "react";
	import { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}

namespace globalThis {
	import type I18n from "src/i18n/i18n-custom";
	export let GlobalStyleSheet: { [name: string]: object };
	export let i18n: typeof I18n;
}

namespace global {
	import type I18n from "src/i18n/i18n-custom";
	export let GlobalStyleSheet: { [name: string]: object };
	export let i18n: typeof I18n;
}
