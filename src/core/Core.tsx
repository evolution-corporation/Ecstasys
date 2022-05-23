import React, {Component, createContext, ReactChildren} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';


import {Alert} from 'react-native'
import type { FC } from 'react'
import type {I18n, LanguageApp} from './i18n'
import i18n from './i18n'
import type {Style, FontWeight} from './style'
import globalStyle from './style';
import type { StatusAuth } from './user'
import User, { account, UserRole, Account } from './user'
import * as Components from './Components'

export enum AppLoading {
  LOADING,
  READY,
  ERROR
}

export interface CoreEvolutionApplicationState {
  account: StatusAuth,
  appStatus: AppLoading,
  language?: LanguageApp,
  themeName?: string
}

declare type CoreEvolutionApplicationAction =
  { type: 'editLanguage', payload: LanguageApp } |
  { type: 'editAccount', payload: StatusAuth } |
  { type: 'editTheme', payload: string | undefined }

export interface CoreEvolutionApplicationProps {
  I18n?: I18n,
  GlobalStyle?: Style,
  Account?: Account,
  
}

export interface EventCallback {
  name: string
  type: 'once' | 'always'
  on: (data: any) => void
}

const EventContext = createContext<{
  addEvent: (name: string, data: any) =>void,
  subscribe: (eventCallback: EventCallback) => void,
  unSubscribe: (name: string) =>void }>(undefined)
EventContext.displayName = 'EventContext'

export default class Core extends Component<CoreEvolutionApplicationProps, CoreEvolutionApplicationState> {
  protected _I18n: I18n
  protected _Account: Account
  protected _GlobalStyle: Style
  protected _route?: JSX.Element
  protected _subscribesEvents: Array<EventCallback> = []
  
  constructor(props: CoreEvolutionApplicationProps) {
    super(props);
    this.state = {
      appStatus: AppLoading.LOADING,
      account: 'loading'
    }
    this._I18n = props.I18n ?? i18n
    this._Account = props.Account ?? account
    this._GlobalStyle = props.GlobalStyle ?? globalStyle
  }
  
  protected _dispatch (action: CoreEvolutionApplicationAction) {
    const state = { ...this.state }
    switch (action.type) {
      case "editLanguage":
        state.language = action.payload
        break
      case "editAccount":
        state.account = action.payload
        break
      case "editTheme":
        state.themeName = action.payload
    }
    if (state.language != undefined && state.account != 'loading' && state.themeName != undefined) {
      state.appStatus = AppLoading.READY
    }
    this.setState({ ...state })
    if (this.state.appStatus == AppLoading.READY) {
      SplashScreen.hideAsync()
    }
  }
  
  componentDidMount() {
    this._I18n.on((language)=>{
      this._dispatch({ type: 'editLanguage', payload: language })
    })
    this._Account.on((account, message) => {
      if (account == 'Error') {
        Alert.alert(message ?? 'no know Error')
        return
      }
      this._dispatch({ type: 'editAccount', payload: account })
    })
    this._GlobalStyle.on((themesName)=> {
      this._dispatch({ type: 'editTheme', payload: themesName })
    })
  }
  
  protected set route(route: JSX.Element) {
    this._route = route
    if (this.state.appStatus != AppLoading.LOADING) {
      this.forceUpdate()
    }
  }
  
  public subscribeEvent(eventCallback: EventCallback): void {
    this._subscribesEvents.push(eventCallback)
  }
  
  public addEventApp(nameEvent: string, data: any): void {
    for (let eventCallback of this._subscribesEvents) {
      if (eventCallback.name == nameEvent) {
        eventCallback.on(data)
        if (eventCallback.type == 'once') {
          this.unSubscribeEvent(nameEvent)
        }
        break
      }
    }
  }
  
  public unSubscribeEvent(nameEvent: string): void {
    this._subscribesEvents = this._subscribesEvents.filter(_eventCallback => _eventCallback.name != nameEvent)
  }
  
  render() {
    if (this.state.appStatus == AppLoading.LOADING && this._route) {
      return null
    }
    return (
      <EventContext.Provider
        value={{
          subscribe: (eventCallback: EventCallback) => this.subscribeEvent(eventCallback),
          unSubscribe: (name: string) => this.unSubscribeEvent(name),
          addEvent: (name: string, data: any) => this.addEventApp(name, data)
        }}
      >
        <Navigation>
            {this._route}
        </Navigation>
      </EventContext.Provider>
    );
  }
}

const Navigation: FC<{ children: ReactChildren }> = (props) => {
  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(navigationRef);
  return (
    <NavigationContainer ref={navigationRef}>
      {props.children}
    </NavigationContainer>
  );
}

export { i18n, globalStyle, account, User, UserRole, Account, EventContext, Components }
export type { FontWeight }