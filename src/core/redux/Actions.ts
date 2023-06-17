import { createAsyncThunk } from '@reduxjs/toolkit'
import {MethodAuth} from "../models/UserAuth";


export const SignInAction = createAsyncThunk(
    "user/SignIn",
    async (payload: { method: MethodAuth, userID: string }, {  }) => {
        return payload
    }
)

export const SignOutAction = createAsyncThunk(
    "user/SignOut",
    async (_, {  }) => {

    }
)
