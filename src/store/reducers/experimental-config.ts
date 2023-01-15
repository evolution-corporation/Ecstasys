/** @format */

import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";

export interface ExperimentalConfigState {
	baseMeditation_dotMeditation: boolean;
	baseMeditation_mandalaMeditation: boolean;
	baseMeditation_noseMeditation: boolean;
}

export type NameExperimentalFunction = keyof ExperimentalConfigState;

const ExperimentalConfigReducer = createReducer<ExperimentalConfigState>(
	{
		baseMeditation_dotMeditation: false,
		baseMeditation_mandalaMeditation: false,
		baseMeditation_noseMeditation: false,
	},
	builder => {
		builder.addCase(actions.ExperimentalConfigInit, (state, { payload }) => {
			for (const experimentalFunction of Object.keys(state) as NameExperimentalFunction[]) {
				if (payload.includes(experimentalFunction)) {
					state[experimentalFunction] = true;
				}
			}
		});
		builder.addCase(actions.ExperimentalConfigEnable, (state, { payload }) => {
			state[payload] = true;
		});
		builder.addCase(actions.ExperimentalConfigDisable, (state, { payload }) => {
			state[payload] = false;
		});
	}
);

export default ExperimentalConfigReducer;
