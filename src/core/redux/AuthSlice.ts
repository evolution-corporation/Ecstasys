import { createSlice } from '@reduxjs/toolkit'

import {MethodAuth} from "../models/UserAuth";



interface AuthState {
   methodAuth?: MethodAuth
}

const initialState: AuthState = {

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // builder.addCase(SignInAction.fulfilled, (state, { payload }) => {
        //     state.currentRootStack =
        //         payload ? ApplicationRootStack.Content : ApplicationRootStack.Registration
        // })
        // builder.addCase(SignOutAction.fulfilled, (state) => {
        //     state.currentRootStack = ApplicationRootStack.Auth
        // })
    }
})


export const applicationReducer = authSlice.reducer

const actions = authSlice.actions

