import React, { FC, useEffect, useReducer } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { connectToDevTools } from "react-devtools-core";
import store from "~store/index";
import { editMood, authentication } from "~store/account";
import {
  editParametersMeditation,
  removeParametersMeditation,
} from "~store/meditation";
import i18n, { LanguageApp } from "~i18n";
import style from "~styles";
import { LoadingStatus, AuthenticationStatus } from "~constants";
import { getMood } from "~api/user";
import { getParametersMeditation } from "~api/meditation";
import Routes from "~routes/index";
import useAuthorization from "~hooks/useAuthorization";
import { Platform, UIManager } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import useAudio from "~hooks/useAudio";
import AudioControlContext from "~contexts/audioControl";

// if (__DEV__) {
//   connectToDevTools({
//     host: "localhost",
//     port: 8097,
//   });
// }

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

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AppCore: FC<Props> = (props) => {
  const moduleStatus = useLoadingModule();
  const { authenticationStatus, isRegistration } = useAuthorization();
  const { audioControl, audioData, setMeditationId } = useAudio();

  useEffect(() => {
    if (authenticationStatus == AuthenticationStatus.AUTHORIZED) {
      store.dispatch(authentication());
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

  useEffect(() => {
    console.log(`Hermes ${!!global.HermesInternal ? "" : "не"} используется`);
  }, [1]);

  if (
    moduleStatus == LoadingStatus.READY &&
    authenticationStatus != AuthenticationStatus.NONE
  ) {
    return (
      <RootSiblingParent>
        <FlipperAsyncStorage />
        <Provider store={store}>
          <AudioControlContext.Provider
            value={{ audioControl, audioData, setAudioData: setMeditationId }}
          >
            <Routes
              authenticationStatus={authenticationStatus}
              isRegistration={isRegistration}
            />
          </AudioControlContext.Provider>
        </Provider>
      </RootSiblingParent>
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
