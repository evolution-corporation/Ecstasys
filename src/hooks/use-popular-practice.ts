/** @format */

import React from "react";
import { Request, Converter } from "src/api";
import { State } from "~types";

export type ReturnPopularPracticeHook = [State.Practice | undefined, () => void, boolean];

const usePopularPractice = (startingInitialization = true): ReturnPopularPracticeHook => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [practice, setIsPractice] = React.useState<State.Practice>();

	const getPractice = async () => {
		setIsLoading(true);
		const practiceToDay = Converter.composePractice(await Request.getPopularToDayMeditation());
		if (practiceToDay !== null) {
			setIsPractice(practiceToDay);
		}
		setIsLoading(false);
	};

	React.useEffect(() => {
		if (startingInitialization) getPractice();
	}, [startingInitialization]);

	return [practice, getPractice, isLoading];
};

export default usePopularPractice;
