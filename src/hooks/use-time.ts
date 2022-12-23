/** @format */
import React from "react";
import { InteractionManager } from "react-native";

const useTimer = (maxMilliseconds: number, onFinish: () => void) => {
	const [currentMilliseconds, setCurrentMilliseconds] = React.useState(0);
	const TimerPromise = React.useRef<ReturnType<typeof InteractionManager.runAfterInteractions>>();
	const cancelInterval = React.useRef<NodeJS.Timer | null>(null);

	const clearIntervalDecorator = () => {
		if (cancelInterval.current !== null) clearInterval(cancelInterval.current);
	};

	const finish = () => {
		clearIntervalDecorator();
		if (onFinish) onFinish();
		TimerPromise.current?.cancel();
	};

	const timer = () => {
		clearIntervalDecorator();
		let current = currentMilliseconds;
		cancelInterval.current = setInterval(() => {
			current += 100;
			if (setCurrentMilliseconds) setCurrentMilliseconds(current);
			if (current >= maxMilliseconds) {
				finish();
			}
		}, 100);
	};
	const play = () => {
		TimerPromise.current?.cancel();
		TimerPromise.current = InteractionManager.runAfterInteractions(() => timer());
	};

	const pause = () => {
		TimerPromise.current?.cancel();
	};

	const edit = (update_value: number, needStart = false) => {
		TimerPromise.current?.cancel();
		clearIntervalDecorator();
		setCurrentMilliseconds(update_value);
		if (needStart) play();
	};

	return [currentMilliseconds, { play, pause, edit }];
};

export default useTimer;
