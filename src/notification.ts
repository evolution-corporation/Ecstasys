/** @format */

import * as Notifications from "expo-notifications";

import { Platform } from "react-native";

if (Platform.OS === "android") {
	Notifications.setNotificationChannelAsync("changeBreathing", {
		name: "Уведомление об изменение дыхании при медитации",
		importance: Notifications.AndroidImportance.HIGH,
		sound: "bells.wav",
	});

	Notifications.setNotificationChannelAsync("endMeditation", {
		name: "Уведомление о конце медитации",
		importance: Notifications.AndroidImportance.HIGH,
		sound: "bells.wav",
	});
}

// const NotificationControllerTask = "notificationController";
//
// TaskManager.defineTask(NotificationControllerTask, ({ error, executionInfo, data }) => {
// 	console.log(data);
// });
//
// Notifications.registerTaskAsync(NotificationControllerTask);
