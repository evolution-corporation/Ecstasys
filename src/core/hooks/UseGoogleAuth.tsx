import React, { useCallback, useEffect, useState } from "react";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";


const useGoogleAuth = () => {
    const [isSupport, setIsSupport] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)


    const authentication = useCallback(async () => {
		setIsLoading(true);

		try {
			const { idToken } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			await auth().signInWithCredential(googleCredential);
		} catch (error) {
			console.error(error)
		}
        setIsLoading(false);
	}, [setIsLoading]);

	useEffect(() => {
		GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false })
			.then(result => {
				setIsSupport(result)
			})
	}, [setIsSupport])

    return {
        isLoading,
		isSupport,
        authentication
    }
}


export default useGoogleAuth