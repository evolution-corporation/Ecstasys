import React, {FC, useEffect, Children} from "react";
import Routes from  './routes'


import useUserContext, { AccountContext, useAccountContext, useAccountHook } from './context'

const e = React.createElement

const Account: FC = ({ children }) => {
	const { state, func } = useAccountHook()

	useEffect(()=>{
		if (!Children.only(children)) {
			throw new Error('Need only children!')
		}
	},[children])

	return (
		e(AccountContext.Provider,
			{ value: { user: state.userData,  func: func, state: state } },
			e(Routes,
				{},
					children
				)
		)
	)
}

export default Account
export { Routes, useUserContext, AccountContext, useAccountContext, useAccountHook }