import React, { Component, createRef, RefObject } from "react";
import { Platform, BackHandler, NativeEventSubscription } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import app from "~firebase";
import i18n, { LanguageApp } from "~i18n";
import { UserAccount, AuthenticationStatus } from "~models/User";
import style from "~styles";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { LoadingStatus } from "~constants";

import LoadingApp from "~screens/LoadingApp";
import AuthorizationByPhone from "~screens/AuthorizationByPhone";
import Registration from "~screens/Registration";
import Main from "~screens/Main";
import SelectionMeditationsParameters from "~screens/SelectionMeditationsParameters";
import SelectMood from "~screens/SelectMood";
import PlayerScreen from "~screens/Player";
import { ScreenRef } from "~components/Screen";

const auth = getAuth(app);

const { Navigator, Screen } = createNativeStackNavigator();

export default class AppCore extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appStatus: LoadingStatus.NONE,
      statusAuthentication: AuthenticationStatus.NONE,
      userAccount: null,
      screenName: "Main",
      screenRef: {
        SelectMoon: createRef(),
        SelectionMeditationsParameters: createRef(),
        Player: createRef(),
      },
      settingScreenRef: {
        Player: createRef(),
      },
      subscribesEvents: [],
      screenList: ["Main"],
      statusLoadingModules: {
        i18n: LoadingStatus.NONE,
        style: LoadingStatus.NONE,
      },
    };
    setTimeout(() => this.loadingModules(), 0);
  }

  protected dispatch(action: Action) {
    const state = { ...this.state };
    switch (action.type) {
      case "EditLanguage":
        state.languageApp = action.payload;
        state.statusLoadingModules.i18n = LoadingStatus.READY;
        break;
      case "EditTheme":
        state.statusLoadingModules.style = action.payload.result;
        break;
      case "EditStatusAuthentication":
        state.statusAuthentication = action.payload.result;
        state.userAccount = action.payload.userData;
        break;
    }

    this.setState(state);
  }

  public subscribeEvent(eventCallback: EventCallback): void {
    this.setState({
      subscribesEvents: [...this.state.subscribesEvents, eventCallback],
    });
  }

  public addEventApp(nameEvent: string, data: any): void {
    for (let eventCallback of this.state.subscribesEvents) {
      if (eventCallback.name == nameEvent) {
        eventCallback.on(data);
        if (eventCallback.type == "once") {
          this.unSubscribeEvent(nameEvent);
        }
        break;
      }
    }
  }

  public unSubscribeEvent(nameEvent: string): void {
    this.setState({
      subscribesEvents: this.state.subscribesEvents.filter(
        (_eventCallback) => _eventCallback.name != nameEvent
      ),
    });
  }

  render() {
    if (this.state.statusAuthentication == AuthenticationStatus.NO_AUTHORIZED) {
      return <AuthorizationByPhone />;
    }
    if (this.state.statusAuthentication == AuthenticationStatus.AUTHORIZED) {
      if (this.state.userAccount == null) {
        return (
          <Registration
            editUserData={(user) => {
              this.dispatch({
                type: "EditStatusAuthentication",
                payload: {
                  userData: user,
                  result: AuthenticationStatus.AUTHORIZED,
                },
              });
            }}
          />
        );
      } else {
        return (
          <NavigationContainer>
            <Navigator>
              <Screen />
              <Main
                key={Math.random().toString()}
                // isFocused={this.state.screenName == "Main"}
                accountInformation={this.state.userAccount}
                appController={this.screenControl}
                isActiveScreen={this.state.screenName == "Main" ? 2 : 0}
              />
              {/* <SelectMood
              key={Math.random().toString()}
              // isFocused={this.state.screenName == "SelectMoon"}
              screenControl={this.state.screenRef.SelectMoon}
              appController={this.screenControl}
              accountInformation={this.state.userAccount}
              isActiveScreen={this.state.screenName == "SelectMoon" ? 1 : 0}
            />
            <SelectionMeditationsParameters
              key={Math.random().toString()}
              // isFocused={
              //   this.state.screenName == "SelectionMeditationsParameters"
              // }
              appController={this.screenControl}
              isActiveScreen={
                this.state.screenName == "SelectionMeditationsParameters"
                  ? 1
                  : 0
              }
              screenControl={
                this.state.screenRef.SelectionMeditationsParameters
              }
            /> */}
              {/* <PlayerScreen
              key={Math.random().toString()}
              // isFocused={this.state.screenName == "Player"}
              appController={this.screenControl}
              zIndex={this.state.screenName == "Player" ? 1 : 0}
              screenControl={this.state.screenRef.Player}
              ref={this.state.settingScreenRef.Player}
            /> */}
            </Navigator>
          </NavigationContainer>
        );
      }
    }
    return <LoadingApp />;
  }

  protected async loadingModules() {
    i18n.on(({ language }) => {
      this.dispatch({ type: "EditLanguage", payload: language });
    });
    style.on(({ loadingStatus }) => {
      this.dispatch({ type: "EditTheme", payload: { result: loadingStatus } });
    });
    onAuthStateChanged(auth, async (user) => {
      let userData: UserAccount | null = null;
      if (user) {
        userData = await UserAccount.authentication();
      }
      this.dispatch({
        type: "EditStatusAuthentication",
        payload: {
          userData,
          result: user
            ? AuthenticationStatus.AUTHORIZED
            : AuthenticationStatus.NO_AUTHORIZED,
        },
      });
    });
  }

  protected addLastScreen = () => {
    this.setState({
      screenName: this.state.screenList[this.state.screenList.length - 1],
    });
  };
  protected addNewScreen = (name: ScreenName) => {
    this.setState({ screenName: name }, () =>
      this.addControlSystemBackButton()
    );
  };
  protected screenControl = {
    goBack: () => {
      if (this.state.screenList.length <= 1) {
        BackHandler.exitApp();
        return;
      }
      this.setState({
        screenList: [
          ...this.state.screenList.slice(0, this.state.screenList.length - 1),
        ],
      });
      if (
        this.state.screenName &&
        this.state.screenRef[this.state.screenName]?.current?.closePage
      ) {
        this.state.screenRef[this.state.screenName]?.current?.closePage(
          true,
          () => this.addLastScreen()
        );
      } else {
        this.addLastScreen();
      }
    },
    editScreen: (name: ScreenName, data?: any) => {
      if (!!data && !!this.state.settingScreenRef[name]) {
        this.state.settingScreenRef[name]?.current?.setParams(data);
      }
      if (
        this.state.screenName &&
        this.state.screenRef[this.state.screenName]?.current?.closePage
      ) {
        this.state.screenRef[this.state.screenName]?.current?.closePage(
          true,
          () => this.addNewScreen(name)
        );
      } else {
        this.addNewScreen(name);
        this.state.screenRef[name]?.current?.openPage();
      }
      this.setState({ screenList: [...this.state.screenList, name] });
    },
  };

  // componentDidUpdate(prevProps: Props, prevState: State) {
  // }

  private controlSystemBackButtonList: {
    screen: ScreenName;
    event: NativeEventSubscription;
  }[] = [];

  private addControlSystemBackButton(
    callback: () => void = this.screenControl.goBack
  ) {
    if (Platform.OS == "android") {
      this.controlSystemBackButtonList.push({
        screen: this.state.screenName,
        event: BackHandler.addEventListener("hardwareBackPress", () => {
          callback();
          return true;
        }),
      });
    }
  }
}

interface EventCallback {
  name: string;
  type: "once" | "always";
  on: (data: any) => void;
}

interface Props {}

interface State {
  appStatus: LoadingStatus;
  userAccount?: UserAccount | null;
  languageApp?: LanguageApp;
  statusAuthentication: AuthenticationStatus;
  screenName: ScreenName;
  screenRef: { [index in ScreenName]?: RefObject<ScreenRef> };
  settingScreenRef: {
    [index in ScreenName]?: RefObject<optionScreenRef>;
  };
  subscribesEvents: EventCallback[];
  screenList: ScreenName[];
  statusLoadingModules: {
    i18n: LoadingStatus;
    style: LoadingStatus;
  };
}

type Action =
  | ActionReducerWithPayload<"EditLanguage", LanguageApp>
  | ActionReducerWithPayload<"EditTheme", { result: LoadingStatus }>
  | ActionReducerWithPayload<
      "EditStatusAuthentication",
      { userData: UserAccount | null; result: AuthenticationStatus }
    >;
