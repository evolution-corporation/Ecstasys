/** @format */

import { actions, useAppDispatch, useAppSelector } from "~store";

export enum TimeSegments {
	ActiveBreathing,
	SpontaneousBreathing,
}

export interface TimeSegment {
	activeBreathing: number;
	setup: number;
	spontaneousBreathing: number;
	freeBreathing: number;
}

const useTimeNotificationDMD = (): [TimeSegment, (timeSegments: TimeSegments, milliseconds: number) => void] => {
	const [activeBreathing, setup, spontaneousBreathing, freeBreathing] = useAppSelector(store => [
		store.DMD.configuratorNotification.activate,
		store.DMD.configuratorNotification.option ?? 0,
		store.DMD.configuratorNotification.random,
		store.DMD.set?.length ?? 0,
	]);
	const appDispatch = useAppDispatch();
	const setValue = (timeSegments: TimeSegments, milliseconds: number) => {
		appDispatch(
			actions.setTimeConfiguratorForDMD({
				type: timeSegments === TimeSegments.ActiveBreathing ? "action" : "random",
				value: milliseconds,
			})
		);
	};

	return [
		{
			activeBreathing,
			setup,
			spontaneousBreathing,
			freeBreathing,
		},
		setValue,
	];
};

export default useTimeNotificationDMD;
