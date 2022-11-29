import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { actions, useAppDispatch } from "src/store";
import auth from "@react-native-firebase/auth";
import appleAuth from "@invertase/react-native-apple-authentication";

export interface AuthenticationMethods {
	signWithGoogle: () => Promise<void>;
	authWithApple: () => Promise<void>;
	authWithPhone: (phone: string) => Promise<(code: string) => Promise<void>>;
	signOut: () => Promise<void>;
}

export type ReturnAuthentication = [AuthenticationMethods, boolean];

const useAuthentication = (): ReturnAuthentication => {
	const [isLoading, setIsLoading] = React.useState(false);
	const appDispatch = useAppDispatch();

	const signWithGoogle = async () => {
		setIsLoading(true);
		try {
			const { idToken } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			await auth().signInWithCredential(googleCredential);
		} catch (error) {
			if (error instanceof Error && error.message === "Sign in action cancelled") {
				setIsLoading(false);
				return;
			}
		}
		setIsLoading(false);
		await appDispatch(actions.sigIn()).unwrap();
	};

	const authWithApple = async () => {
		setIsLoading(true);
		try {
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
			});
			const appleCredential = auth.AppleAuthProvider.credential(
				appleAuthRequestResponse.identityToken,
				appleAuthRequestResponse.nonce
			);
			await auth().signInWithCredential(appleCredential);
		} catch (error) {
			if (error instanceof Error && error.message === "Sign in action cancelled") {
				setIsLoading(false);
				return;
			}
		}
		setIsLoading(false);
		await appDispatch(actions.sigIn()).unwrap();
	};

	const authWithPhone = async (phoneNumber: string) => {
		setIsLoading(true);
		const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
		setIsLoading(false);
		return async (code: string) => {
			setIsLoading(true);
			confirmation.confirm(code);
			setIsLoading(false);
			await appDispatch(actions.sigIn()).unwrap();
		};
	};

	const signOut = async () => {
		setIsLoading(true);
		await appDispatch(actions.signOutAccount()).unwrap();
		setIsLoading(false);
	};

	return [{ signWithGoogle, authWithApple, authWithPhone, signOut }, isLoading];
};

export default useAuthentication;
