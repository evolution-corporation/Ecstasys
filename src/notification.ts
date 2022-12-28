/** @format */

import * as Notifications from "expo-notifications";

Notifications.setNotificationChannelAsync("changeBreathing", {
	name: "Уведомление об изменение дыхании при медитации",
	importance: Notifications.AndroidImportance.HIGH,
	sound: "bells.wav",
});
