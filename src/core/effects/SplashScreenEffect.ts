import { createListenerMiddleware } from '@reduxjs/toolkit'
import { ApplicationStatus } from '../redux/ApplicationSlice'
import { RootState } from '../redux/Store'
import * as SplashScreen from "expo-splash-screen";

const SplashScreenMiddleware = createListenerMiddleware()

SplashScreenMiddleware.startListening({
    predicate: () => true,
    effect: (_, listenerApi) => {
        const state = listenerApi.getState() as RootState
        if (state.applicationReducer.applicationStatus === ApplicationStatus.loading) {
            SplashScreen.preventAutoHideAsync();
        } else {
            SplashScreen.hideAsync();
        }
        return;
    }
})

export default SplashScreenMiddleware