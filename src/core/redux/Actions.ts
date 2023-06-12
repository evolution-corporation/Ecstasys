import { createAsyncThunk } from '@reduxjs/toolkit'


export const SignInAction = createAsyncThunk(
    "user/SignIn",
    async (userData: string, {  }) => {
        return userData
    }
)

export const SignOutAction = createAsyncThunk(
    "user/SignOut",
    async (_, {  }) => {

    }
)