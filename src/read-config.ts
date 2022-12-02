/** @format */

import DevelopmentFunctionConfig from "config/development-function.json";

export const developmentConfig = (nameField: keyof typeof DevelopmentFunctionConfig) =>
	DevelopmentFunctionConfig[nameField];
