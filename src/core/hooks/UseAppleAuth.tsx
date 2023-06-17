import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native"

// import auth from "@react-native-firebase/auth";


const useAppleAuth = () => {

    const [isSupport, setIsSupport] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)


    const authentication = useCallback(async () => {
		setIsLoading(true);
        try {
            const appleAuthModule = await import("expo-apple-authentication");
            const { identityToken } = await appleAuthModule.signInAsync({ 
                requestedScopes: [
					appleAuthModule.AppleAuthenticationScope.FULL_NAME,
					appleAuthModule.AppleAuthenticationScope.EMAIL,
				],
            });
            const appleCredential = auth.AppleAuthProvider.credential(identityToken);
            await auth().signInWithCredential(appleCredential);
        } catch {
            
        }
        setIsLoading(false);
    }, [isSupport, setIsLoading])

	useEffect(() => {
        if (Platform.OS === "ios") {
            import("expo-apple-authentication").then((appleAuthModule) => {
                appleAuthModule.isAvailableAsync().then(result => setIsSupport(result));
            })
        }
	}, [setIsSupport])

    return {
        isLoading,
		isSupport,
        authentication
    }
}


export default useAppleAuth