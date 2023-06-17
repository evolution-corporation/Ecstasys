import {GoogleSignin, statusCodes, User} from "@react-native-google-signin/google-signin"

import type FacadeInterfaceAuthentication, {
    ListenerOnInitialization,
    SignInPayload
} from "./FacadeInterfaceAuthentication";
import MethodAuth from "./MethodAuth";
import InitializationStatus from "./InitializationStatus";
import SignInStatus from "./SignInStatus";


GoogleSignin.configure({
	webClientId: "878799007977-cj3549ni87jre2rmg4eq0hiolp08igh2.apps.googleusercontent.com",
	offlineAccess: true
});


let initializationStatus = InitializationStatus.Loading;
const listListener = new Set<ListenerOnInitialization>();

const sendStatusListener = (status: InitializationStatus) => {
    for (const listener of listListener.values()) {
        listener(status)
    }
}
const addListener = (callback: ListenerOnInitialization) => {
    listListener.add(callback)
}
const removeListener = (callback: ListenerOnInitialization) => {
    listListener.delete(callback)
}

GoogleSignin.hasPlayServices()
    .then((isHas) => {
        initializationStatus = isHas ? InitializationStatus.Ready : InitializationStatus.NoSupport;
        sendStatusListener(initializationStatus);
    })
    .catch(() => {
        initializationStatus = InitializationStatus.Error;
        sendStatusListener(InitializationStatus.Error)
    })



const onInitialization = (callback: ListenerOnInitialization) => {
    addListener(callback)
    return () => removeListener(callback)
}

const type = MethodAuth.Google

const signInResultFactory = (status: SignInStatus, payload?: User) => {
    return [
        status,
        payload ? {
            name: payload.user.name,
            image: payload.user.photo,
        } : undefined
    ] as [SignInStatus, SignInPayload?]
}


const signIn = async () => {
    try {
        const user = await GoogleSignin.signIn()
        return signInResultFactory(SignInStatus.ok, user)
    } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return signInResultFactory(SignInStatus.cancel)
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return signInResultFactory(SignInStatus.noSupport)
        return signInResultFactory(SignInStatus.unknowError)
    }
}


const signOut = async () => {
    await GoogleSignin.signOut()
}

const getJWT = async () => {
    const user = await GoogleSignin.getCurrentUser()
    return user?.idToken ?? null
}

const isSupport = () => initializationStatus === InitializationStatus.Ready

export default {
    type,
    onInitialization,
    signIn,
    signOut,
    getJWT,
    status: initializationStatus,
    isSupport
} as FacadeInterfaceAuthentication
