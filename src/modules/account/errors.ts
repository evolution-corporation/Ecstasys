import { State} from './types'

export function needAuthorization(state: State) {
	if (state.authenticationStatus !== 'authentication') {
		throw new Error("Need Authorization")
	}
}

export function needRegistration(state: State) {
	needAuthorization(state)
	if (state.registrationStatus !== 'registration' || !state.userData) {
		throw new Error("Need Registration")
	}
}