import type MethodAuth from "./MethodAuth"
import type InitializationStatus from "./InitializationStatus";
import SignInStatus from "./SignInStatus";

export type UnsubscribeOnInitialization = () => void

export type ListenerOnInitialization = (status: InitializationStatus) => void

export type SubscribeOnInitialization = (status: ListenerOnInitialization) => UnsubscribeOnInitialization

export type SignInPayload = {
    name?: string,
    image?: string
}

interface FacadeInterfaceAuthentication {
    type: MethodAuth,

    signIn: () => Promise<[SignInStatus, SignInPayload?]>

    signOut: () => Promise<void>

    getJWT: () => Promise<string | null>

    isSupport: () => boolean

    status: InitializationStatus

    onInitialization: SubscribeOnInitialization
}

export default FacadeInterfaceAuthentication
