import React, { FC, useEffect, useMemo, useReducer, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { connectToDevTools } from "react-devtools-core";
import store from "~store/index";
import { authentication, signOut, editMood } from "~store/account";
import {
  editParametersMeditation,
  removeParametersMeditation,
} from "~store/meditation";
import app from "~firebase";
import i18n, { LanguageApp } from "~i18n";
import style from "~styles";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { LoadingStatus, AuthenticationStatus } from "~constants";
import { getMood } from "~api/user";
import { getParametersMeditation } from "~api/meditation";
import Routes from "~routes/index";
import { Platform, UIManager } from "react-native";

const auth = getAuth(app);

if (__DEV__) {
  connectToDevTools({
    host: "localhost",
    port: 8097,
  });
}

function useLoadingModule(): LoadingStatus {
  const [state, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case "EditLanguage":
          state.languageApp = action.payload;
          state.statusLoadingModules.i18n = LoadingStatus.READY;
          break;
        case "EditTheme":
          state.statusLoadingModules.style = action.payload.result;
          break;
      }
      if (
        state.statusLoadingModules.style == LoadingStatus.READY &&
        state.statusLoadingModules.i18n == LoadingStatus.READY
      ) {
        state.appStatus = LoadingStatus.READY;
      }
      return { ...state };
    },
    {
      appStatus: LoadingStatus.NONE,
      statusLoadingModules: {
        i18n: LoadingStatus.NONE,
        style: LoadingStatus.NONE,
      },
    }
  );

  useEffect(() => {
    console.log("Loading Module");
    i18n.on(({ language }) => {
      dispatch({ type: "EditLanguage", payload: language });
    });
    style.on(({ loadingStatus }) => {
      dispatch({ type: "EditTheme", payload: { result: loadingStatus } });
    });
  }, [dispatch]);

  return state.appStatus;
}

function useAuthenticationStatus(): [AuthenticationStatus, boolean] {
  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>(AuthenticationStatus.NONE);
  const [isRegistration, setIsRegistration] = useState<boolean>(false);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await store.dispatch(authentication()).unwrap();
        if (data == null) {
          setIsRegistration(false);
        } else {
          setIsRegistration(true);
        }
        setAuthenticationStatus(AuthenticationStatus.AUTHORIZED);
      } else {
        store.dispatch(signOut());
        setAuthenticationStatus(AuthenticationStatus.NO_AUTHORIZED);
      }
    });
  }, [setAuthenticationStatus, setIsRegistration]);

  return [authenticationStatus, isRegistration];
}
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AppCore: FC<Props> = (props) => {
  const moduleStatus = useLoadingModule();
  const [authenticationStatus, isRegistration] = useAuthenticationStatus();
  useEffect(() => {
    if (authenticationStatus == AuthenticationStatus.AUTHORIZED) {
      getMood().then((mood) => {
        store.dispatch(editMood(mood));
      });
      getParametersMeditation().then((parameters) => {
        if (parameters[0] == "exist") {
          store.dispatch(editParametersMeditation(parameters[1]));
        } else {
          store.dispatch(removeParametersMeditation());
        }
      });
    }
  }, [authenticationStatus]);

  useEffect(() => {
    if (
      authenticationStatus != AuthenticationStatus.NONE &&
      moduleStatus == LoadingStatus.READY
    ) {
      SplashScreen.hideAsync();
    } else {
      SplashScreen.preventAutoHideAsync();
    }
  }, [authenticationStatus, moduleStatus]);

  if (
    moduleStatus == LoadingStatus.READY &&
    authenticationStatus != AuthenticationStatus.NONE
  ) {
    return (
      <Provider store={store}>
        <Routes
          authenticationStatus={authenticationStatus}
          isRegistration={isRegistration}
        />
      </Provider>
    );
  }
  return null;
};

interface Props {}

interface State {
  appStatus: LoadingStatus;
  languageApp?: LanguageApp;
  statusLoadingModules: {
    i18n: LoadingStatus;
    style: LoadingStatus;
  };
}

type Action =
  | ActionReducerWithPayload<"EditLanguage", LanguageApp>
  | ActionReducerWithPayload<"EditTheme", { result: LoadingStatus }>;

export default AppCore;
