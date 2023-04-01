/** @format */

import { useEffect } from "react";

const useBaseMeditationInformation = (): [boolean, { [key: string]: boolean }] => {
	return [
		true,
		{
			dotMeditation: true,
			mandalaMeditation: true,
			noseMeditation: true,
		},
	];
};

export default useBaseMeditationInformation;
