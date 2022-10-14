/** @format */

import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";
import { State } from "~types";
import ListMessage from "~assets/messageProfessor.json";
export interface StyleState {
	loaded: boolean;
	messageProfessor: State.MessageProfessor;
}

export default createReducer<StyleState>(
	{
		loaded: false,
		messageProfessor: {
			idMessage: ListMessage[0],
			dateTimeLastUpdate: new Date().toISOString(),
		},
	},
	builder => {
		builder.addCase(actions.initialization.fulfilled, (state, { payload }) => {
			state.loaded = true;
			state.messageProfessor = payload.messageProfessor;
		});
	}
);
