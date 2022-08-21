import {createContext, useContext, useEffect, useMemo, useReducer} from 'react'
import auth from "@react-native-firebase/auth";

import {Action, State, UpdateUserData, UserDataApplication, Func} from './types'
import {authentication, registration, update} from "./api";

export const AccountContext = createContext<{ user: UserDataApplication | undefined, func: Func, state: State } | null>(null)


export function useAccountHook() {
	const [state, dispatch] = useReducer(Reducer, {
		authenticationStatus: 'authentication'
	})

	useEffect(()=>{
		auth().onAuthStateChanged(async (user)=>{
			if (!user) {
				dispatch({ type: 'out' })
			} else {
				dispatch({ type: 'in', payload: await authentication()})
			}
		})
	}, [dispatch])


	const func: Func = useMemo(()=>({
		editUserData: async (payload: UpdateUserData) => dispatch({ type: 'edit', payload }),
		registration: async () => {
			if (!!state.editUserData && state.editUserData.nickName && state.editUserData.birthday) {
				dispatch({
					type: 'registration',
					payload: await registration(state.editUserData.nickName, state.editUserData.birthday)
				})
			}
		},
		update: async () => {
			if (!!state.editUserData) {
				dispatch({
					type: 'update',
					payload: await update(state.editUserData)
				})
			}
		},
		authenticationWithPhone: async (phone: string) => {
			dispatch({
				type: 'authorizationByPhone',
				payload: { confirm: await auth().signInWithPhoneNumber(phone), phone: phone}
			})
		},
		requestSMSCode: async () => {
			if (!!state.phone) {
				await func.authenticationWithPhone(state.phone)
			}
		},
		checkSMSCode: async (code: string) => {
			if (!!state.confirmResultByPhone) {
				await state.confirmResultByPhone.confirm(code)
			}
		}
	}),[state.registrationStatus, state.authenticationStatus, state.editUserData, state.phone, state.confirmResultByPhone])

	return { state, func }
}



function Reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'out':
			state.editUserData = undefined
			state.registrationStatus = undefined
			state.userData = undefined
			state.phone = undefined
			state.confirmResultByPhone = undefined
			state.authenticationStatus = 'noAuthentication'
			break
		case "in":
			state.confirmResultByPhone = undefined
			state.authenticationStatus = 'authentication'
			state.registrationStatus = !!action.payload ? 'registration' : 'noRegistration'
			if (state.registrationStatus === 'registration' && action.payload) {
				state.userData = action.payload
			}
			break
		case 'edit':
			if (!state.editUserData) {
				state.editUserData = {}
			}
			if (!!action.payload.name) {
				state.editUserData.name = action.payload.name
			}
			if (!!action.payload.image) {
				state.editUserData.image = action.payload.image
			}
			if (!!action.payload.birthday) {
				state.editUserData.birthday = action.payload.birthday
			}
			if (!!action.payload.surname) {
				state.editUserData.surname = action.payload.surname
			}
			if (!!action.payload.nickName) {
				state.editUserData.nickName = action.payload.nickName
			}
			break
		case "registration":
			state.registrationStatus = 'registration'
			state.editUserData = undefined
			state.userData = action.payload
			break
		case "update":
			state.editUserData = undefined
			state.userData = action.payload
			break
		case "authorizationByPhone":
			state.confirmResultByPhone = action.payload.confirm
			state.phone = action.payload.phone
			break
	}

	return { ...state }
}

export const useAccountContext = () => {
	const accountState = useContext(AccountContext)
	if (!accountState) throw new Error('Account context not initialization')
	return accountState
}


export default () => {
	const context = useContext(AccountContext);
	if (!!context) {
		return { user: context.user, func: context.func }
	}
	throw new Error("User context not initialization")
}