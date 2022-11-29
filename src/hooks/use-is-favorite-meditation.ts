import React from "react";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { State } from "~types";

export type ReturnIsFavoriteMeditationHook = [boolean, () => Promise<State.Practice>, boolean];

const useIsFavoriteMeditation = (meditation: State.Practice): ReturnIsFavoriteMeditationHook => {
	const [isLoading, setIsLoading] = React.useState(false);
	const isFavorite = useAppSelector(
		store => store.practice.listPracticesFavorite.findIndex(({ id }) => meditation.id === id) !== -1
	);
	const appDispatch = useAppDispatch();
	const changeResult = async () => {
		setIsLoading(true);
		const result = await appDispatch(
			isFavorite ? actions.removeFavoritePractice(meditation) : actions.addFavoritePractice(meditation)
		).unwrap();
		setIsLoading(false);
		return result;
	};
	return [isFavorite, changeResult, isLoading];
};

export default useIsFavoriteMeditation;
