import type { RootState } from "./Store";

export const currentRootStackSelector = (store: RootState) => store.applicationReducer.currentRootStack