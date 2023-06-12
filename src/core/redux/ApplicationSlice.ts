import { createSlice } from '@reduxjs/toolkit'
import { SignInAction, SignOutAction } from './Actions';


export enum ApplicationRootStack {
    Auth,
    Registration,
    Content
}

export enum ApplicationAccess {
    online,
    offline
}

export enum ApplicationStatus {
    loading,
    ready,
}

interface ApplicationState {
    currentRootStack: ApplicationRootStack;
    accessApplication: ApplicationAccess;
    applicationStatus: ApplicationStatus;
}

const initialState: ApplicationState = {
    currentRootStack: ApplicationRootStack.Auth,
    accessApplication: ApplicationAccess.online,
    applicationStatus: ApplicationStatus.loading,
}

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        applicationReady: (state) => {
            state.applicationStatus = ApplicationStatus.ready
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SignInAction.fulfilled, (state, { payload }) => {
            state.currentRootStack = 
                payload ? ApplicationRootStack.Content : ApplicationRootStack.Registration 
        })
        builder.addCase(SignOutAction.fulfilled, (state) => {
            state.currentRootStack = ApplicationRootStack.Auth
        })
    }
})


export const applicationReducer = applicationSlice.reducer

const actions = applicationSlice.actions

export const applicationReady = actions.applicationReady