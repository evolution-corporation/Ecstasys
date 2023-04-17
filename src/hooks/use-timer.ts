/** @format */
import React, { useEffect, useRef } from "react";
import { AppState, InteractionManager } from "react-native";
import * as Notification from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const timeUpdate = 100;

const NotificationEndMeditation = (date: Date) =>
	Notification.scheduleNotificationAsync({
		identifier: "EndMeditation",
		content: {
			title: "Медитация подошла к концу",
			body: "Благодарим за уделенное время",
			sound: "bells.wav",
			vibrate: [1],
			priority: Notification.AndroidNotificationPriority.MAX,
		},
		trigger: {
			date,
			channelId: "endMeditation",
		},
	});

const useTimer = (maxMilliseconds: number, onFinish: () => void) => {
	const [currentMilliseconds, setCurrentMilliseconds] = React.useState(0);
	const TimerPromise = React.useRef<ReturnType<typeof InteractionManager.runAfterInteractions>>();
	const cancelInterval = React.useRef<NodeJS.Timer>();
	const timeStartBackgroundApplication = React.useRef<Date>();
	const fixTime = useRef<number>(0);

	useEffect(() => {
		fixTime.current = Math.floor(currentMilliseconds);
	}, [currentMilliseconds]);

	const clearIntervalDecorator = () => {
		if (cancelInterval.current !== undefined) clearInterval(cancelInterval.current);
		cancelInterval.current = undefined;
	};

	const finish = () => {
		clearIntervalDecorator();
		if (onFinish) onFinish();
		TimerPromise.current?.cancel();
	};

	React.useEffect(() => {
		if (currentMilliseconds >= maxMilliseconds) {
			finish();
		}
	}, [currentMilliseconds]);

	const timer = async () => {
		clearIntervalDecorator();
		cancelInterval.current = setInterval(
			() =>
				setCurrentMilliseconds(previousTime => {
					let newTime = timeUpdate + previousTime;
					if (newTime >= maxMilliseconds) newTime = maxMilliseconds;
					return newTime;
				}),
			timeUpdate
		);
	};

	const getEndTime = () => {
		return new Date(Date.now() + maxMilliseconds - fixTime.current);
	};

	const addEndTimeMeditationInStorage = async () => {
		await AsyncStorage.setItem("EndMeditationTime", getEndTime().toISOString());
	};

	const play = () => {
		TimerPromise.current?.cancel();
		timer();
		addEndTimeMeditationInStorage();
		// TimerPromise.current = InteractionManager.runAfterInteractions(() => timer());
	};

	const pause = () => {
		clearIntervalDecorator();
		TimerPromise.current?.cancel();
	};

	const edit = (update_value: number) => {
		clearIntervalDecorator();
		TimerPromise.current?.cancel();
		setCurrentMilliseconds(_previous => {
			if (update_value <= 0) return 0;
			if (update_value >= maxMilliseconds) return maxMilliseconds;
			return update_value;
		});
	};

	const notificationID = useRef<string | null>(null);

	React.useEffect(() => {
		const subscribe = AppState.addEventListener("change", state => {
			if (state === "active" && timeStartBackgroundApplication.current !== undefined) {
				if (notificationID.current !== null) Notification.cancelScheduledNotificationAsync(notificationID.current);
				const deltaTime = Date.now() - timeStartBackgroundApplication.current.getTime();
				setCurrentMilliseconds(previousTime => {
					const time = previousTime + deltaTime;
					if (time <= 0) return 0;
					if (time >= maxMilliseconds) return maxMilliseconds;
					return time;
				});
				play();
				timeStartBackgroundApplication.current = undefined;
			} else if (state === "background" && cancelInterval.current !== undefined) {
				timeStartBackgroundApplication.current = new Date();

				const endMeditation = getEndTime();
				NotificationEndMeditation(endMeditation).then(id => (notificationID.current = id));
				pause();
			}
		});
		return () => {
			subscribe.remove();
		};
	}, []);

	return { currentMilliseconds: currentMilliseconds, play, pause, edit };
};

export default useTimer;
