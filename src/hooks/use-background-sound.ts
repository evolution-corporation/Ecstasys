/** @format */

import BackgroundSound from "src/backgroundSound";
import { useAppSelector } from "~store";

const useBackgroundSound = (): keyof typeof BackgroundSound | null => {
	const name = useAppSelector(store => store.practice.paramsPractice.currentNameBackgroundSound);
	return name;
};

export default useBackgroundSound;
