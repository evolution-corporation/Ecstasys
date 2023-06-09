/** @format */


import { useAppSelector } from "src/store/index";

const useIsActivateSubscribe = () => {

		return useAppSelector(store => {
			if (store.account.subscribe === undefined) {
				return false;
			} else {
				const endSubscribe = new Date(store.account.subscribe.endSubscribe);

				return endSubscribe.getTime() > Date.now();
			}
		});
	};


export default useIsActivateSubscribe;
