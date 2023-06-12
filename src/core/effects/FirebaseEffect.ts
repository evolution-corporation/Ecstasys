import store from '../redux/Store'

import auth from "@react-native-firebase/auth";
import { SignInAction, SignOutAction } from '../redux/Actions';


auth().onAuthStateChanged((user) => {
    if (user) {
        const uid = user.uid
        console.log("user", user.uid)
        store.dispatch(SignInAction(uid))
    } else {
        console.log("user out")
        store.dispatch(SignOutAction())
    }
})

