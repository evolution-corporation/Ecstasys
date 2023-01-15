/** @format */

import { createAction } from "@reduxjs/toolkit";
import type { NameExperimentalFunction } from "../reducers/experimental-config";

export enum ExperimentalConfigAction {
	init = "experimentalConfig/init",
	enable = "experimentalConfig/enable",
	disable = "experimentalConfig/disable",
}

export const ExperimentalConfigEnable = createAction<NameExperimentalFunction>(ExperimentalConfigAction.enable);

export const ExperimentalConfigDisable = createAction<NameExperimentalFunction>(ExperimentalConfigAction.disable);

export const ExperimentalConfigInit = createAction<NameExperimentalFunction[]>(ExperimentalConfigAction.init);
