export interface UID {
    uid: string
}

export enum SignInMethod {
    google,
    phone,
    apple
}

export interface IUserDate {
    displayName: string | null
    photoURL: string | null
}

export interface IUserSignInOut {
    signIn(type: SignInMethod.google | SignInMethod.apple, credential: string): Promise<UID>;
    // signIn(type: SignInMethod.phone, phone: string, code: string): Promise<UID>;

    signOut(): Promise<void>

    getCurrentUID(): string | null

    getUserData(): IUserDate | null

    openGoogleSignIn(): Promise<string | null>

    openAppleSignIn(): Promise<string | null>

    onChangeUser(
        callbackSignIn: (userId: string) => void,
        callbackSignOut: () => void
    ): () => void

    getJWT(): Promise<string | null>
}