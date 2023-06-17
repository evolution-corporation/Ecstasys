import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import SplashScreenMiddleware from '../effects/SplashScreenEffect';
import usersApi from './api/UsersApi';
import { applicationReducer } from './ApplicationSlice'


const store = configureStore({
    reducer: {
        applicationReducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        const defaultMiddleware =  getDefaultMiddleware();
        const newMiddleware = [
            usersApi.middleware,
            SplashScreenMiddleware.middleware
        ];
        if (__DEV__) newMiddleware.push(require("redux-flipper").default());
        return defaultMiddleware.concat(...newMiddleware)
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store
