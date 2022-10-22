/** @format */

import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";
import { State } from "~types";

export interface StyleState {
	messageProfessor?: State.MessageProfessor;
}

export default createReducer<StyleState>({}, builder => {
	builder.addCase(actions.initialization.fulfilled, (state, { payload }) => {
		const { messageProfessor } = payload;
		state.messageProfessor = messageProfessor;
	});
});
