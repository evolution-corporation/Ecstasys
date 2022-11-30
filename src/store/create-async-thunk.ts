import { createAsyncThunk } from "@reduxjs/toolkit";
import type { default as store, RootState } from "~store";

const createAsyncThunkApp = createAsyncThunk.withTypes<{
	state: RootState;
	dispatch: typeof store.dispatch;
	rejectValue: string;
	extra: { s: string; n: number };
}>();

export default createAsyncThunkApp;
