import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import SplashScreenMiddleware from '../effects/SplashScreenEffect';
import { applicationReducer } from './ApplicationSlice'


const store = configureStore({
    reducer: {
        applicationReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().prepend(SplashScreenMiddleware.middleware)
    
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store