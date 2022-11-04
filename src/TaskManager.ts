/** @format */

import * as TaskManager from "expo-task-manager";
import { InteractionManager } from "react-native";

export enum TaskName {
	timePractice = "~timePractice",
}

//! setInterval in runAfterInteractions
// * ~30-40 fps
export const initializationTimer = (callback: () => void, milliseconds: number = 100) => {
	let timer: NodeJS.Timer;
	const task = InteractionManager.runAfterInteractions(() => {
		timer = setInterval(() => callback(), milliseconds);
	});
	return () => {
		task.cancel();
		clearInterval(timer);
	};
};
