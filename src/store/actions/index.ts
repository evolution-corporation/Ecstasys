/** @format */

import * as Account from "./account";
import * as Style from "./style";
import * as General from "./general";
import * as Practice from "./practice";
import * as DMD from "./DMD";
import * as ExperimentalConfig from "./experimental-config";

export default {
	...Account,
	...Style,
	...General,
	...Practice,
	...DMD,
	...ExperimentalConfig,
};
