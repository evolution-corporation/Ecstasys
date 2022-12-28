/** @format */

import React, { useEffect } from "react";
import * as Notification from "expo-notifications";
import { Breathing } from "~types";

const useBreathingController = () => {
	const identifiers = React.useRef<string[]>([]);

	const removeNotification = () => {
		for (const identifier of identifiers.current) {
			Notification.cancelScheduledNotificationAsync(identifier);
		}
		identifiers.current = [];
	};

	const setNotifications = async (timesNotification: { type: Breathing; time: number }[]) => {
		for (const identifier of identifiers.current) {
			await Notification.cancelScheduledNotificationAsync(identifier);
		}
		identifiers.current = [];
		for (const { type, time } of timesNotification) {
			const message =
				type === Breathing.Active
					? "Начинайте дышать активно"
					: type === Breathing.Free
					? "Дышите спокойно"
					: type === Breathing.Spontaneous
					? "Экспериментируйте с дыханием"
					: "Дышите свободно";
			Notification.scheduleNotificationAsync({
				content: {
					title: "Пора сменить дыхание",
					body: message,
					sound: "bells.wav",
					vibrate: [1],
					priority: Notification.AndroidNotificationPriority.MAX,
				},
				trigger: {
					seconds: Math.floor(time / 1000),
					channelId: "changeBreathing",
				},
			}).then(identifier => identifiers.current.push(identifier));
		}
	};

	useEffect(() => {
		Notification.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: false,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
		});
		return () => {
			removeNotification();
		};
	}, []);

	return {
		set: setNotifications,
		remove: removeNotification,
	};
};

export default useBreathingController;
