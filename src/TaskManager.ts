/** @format */

import * as TaskManager from "expo-task-manager";
import { InteractionManager } from "react-native";

export enum TaskName {
	timePractice = "~timePractice",
}

// TaskManager.defineTask(TaskName.timePractice, ({ data, error, executionInfo }) => {
// 	const {} = data;
// 	setTimeout(() => {
// 		console.log("test Task ", data);
// 	}, 10000);
// });

//! setInterval in InteractionManager.createInteractionHandle
// * ~30-35 fps
// export const initializationTimer = (callback: () => void, milliseconds: number = 100) => {
// 	const handle = InteractionManager.createInteractionHandle();
// 	const timer = setInterval(() => callback(), milliseconds);

// 	return () => {
// 		InteractionManager.clearInteractionHandle(handle);
// 		clearInterval(timer);
// 	};
// };

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
