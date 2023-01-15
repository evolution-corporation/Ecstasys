/** @format */

import type { NameExperimentalFunction } from "src/store/reducers/experimental-config";
import { actions, useAppDispatch, useAppSelector } from "~store";

const useExperimentalFunction = (name: NameExperimentalFunction) => {
	const status = useAppSelector(store => store.ExperimentalConfig[name]);
	const dispatch = useAppDispatch();
	const enable = () => dispatch(actions.ExperimentalConfigEnable(name));
	const disable = () => dispatch(actions.ExperimentalConfigDisable(name));
	return {
		status,
		enable,
		disable,
	};
};

export default useExperimentalFunction;
