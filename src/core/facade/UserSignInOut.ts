import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import { IUserDate, IUserSignInOut, SignInMethod, UID } from "./Interfaces";



class UserSignInOut implements IUserSignInOut {
    async signIn(type: SignInMethod.google | SignInMethod.apple, idToken: string): Promise<UID>;
    async signIn(type: SignInMethod.phone, phone: string, code: string): Promise<UID>;
    async signIn(type: SignInMethod, payload1: string, payload2?: string): Promise<UID> {
        let uid;
        switch (type) {
            case SignInMethod.google: {
                const googleCredential = auth.GoogleAuthProvider.credential(payload1);
			    const { user } = await auth().signInWithCredential(googleCredential);
                uid = user.uid
                break
            }
            case SignInMethod.apple: {
                const googleCredential = auth.GoogleAuthProvider.credential(payload1);
			    const { user } = await auth().signInWithCredential(googleCredential);
                uid = user.uid
                break
            }
            case SignInMethod.phone: {
                throw new Error("TODO")
            }
        }
        return { uid }
    }
    
    async signOut() {
        await auth().signOut()
    }

    async openGoogleSignIn(): Promise<string | null> {
        const { idToken } = await GoogleSignin.signIn();
        return idToken
		
    }

    async openAppleSignIn(): Promise<string | null> {
        if (Platform.OS === "ios") {
            const appleAuthModule = await import("expo-apple-authentication");
            const { identityToken } = await appleAuthModule.signInAsync({ 
                requestedScopes: [
					appleAuthModule.AppleAuthenticationScope.FULL_NAME,
					appleAuthModule.AppleAuthenticationScope.EMAIL,
				],
            });
            return identityToken
        }
        return null
    }

    async getJWT(): Promise<string | null> {
        const user = auth().currentUser;
        if (!user) return null
        return user.getIdToken() 
    }

    getCurrentUID(): string | null {
        return auth().currentUser?.uid ?? null
    }

    getUserData(): IUserDate | null {
        return auth().currentUser
    }

    onChangeUser(callbackSignIn: (userId: string) => void, callbackSignOut: () => void): () => void {
        return auth().onAuthStateChanged((user) => {
            if (user) {
                callbackSignIn(user.uid)
            } else {
                callbackSignOut()
            }
        })
    }
}

export default UserSignInOut