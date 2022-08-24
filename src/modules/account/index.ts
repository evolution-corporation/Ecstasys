import React, { FC } from "react";
import Routes, { Props as RoutesProps } from  './routes'

import useAccountHook from './useAccountHook'
import AccountContext, { useAccountContext, useUserContext, useTimerSMSRequestContext } from "~modules/account/AccountContext";

const e = React.createElement

const Account: FC<Props> = ({ routes }) => {
	const { state, func } = useAccountHook()

	return (
		e(AccountContext.Provider,
			{ value: { user: state.userData, func: func, state: state } },
			e(Routes,
				routes ,
				)
		)
	)
}

interface Props {
	routes: RoutesProps
}

const contextHook = {
	account: useAccountContext,
	user: useAccountContext,
	timerSMSRequest: useTimerSMSRequestContext

}

export default Account
export {
	Routes, useUserContext, AccountContext, contextHook
}