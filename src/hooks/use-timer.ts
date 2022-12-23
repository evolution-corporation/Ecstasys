/** @format */
import React from "react";
import { InteractionManager, AppState } from "react-native";

const timeUpdate = 1000;

const useTimer = (maxMilliseconds: number, onFinish: () => void) => {
	const [currentMilliseconds, setCurrentMilliseconds] = React.useState(0);
	const TimerPromise = React.useRef<ReturnType<typeof InteractionManager.runAfterInteractions>>();
	const cancelInterval = React.useRef<NodeJS.Timer | null>(null);
	const timeStartBackgroundApplication = React.useRef<Date | null>(null);

	const clearIntervalDecorator = () => {
		if (cancelInterval.current !== null) clearInterval(cancelInterval.current);
		cancelInterval.current = null;
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

	const play = () => {
		TimerPromise.current?.cancel();
		timer();
		// TimerPromise.current = InteractionManager.runAfterInteractions(() => timer());
	};

	const pause = () => {
		clearIntervalDecorator();
		TimerPromise.current?.cancel();
	};

	const edit = (update_value: number) => {
		clearIntervalDecorator();
		TimerPromise.current?.cancel();
		setCurrentMilliseconds(_previous => update_value);
	};

	React.useEffect(() => {
		const subscribe = AppState.addEventListener("change", state => {
			if (state === "active" && timeStartBackgroundApplication.current !== null) {
				const deltaTime = Date.now() - timeStartBackgroundApplication.current.getTime();
				setCurrentMilliseconds(previousTime => (previousTime += deltaTime));
				play();
				timeStartBackgroundApplication.current = null;
			} else if (state === "background" && cancelInterval.current !== null) {
				timeStartBackgroundApplication.current = new Date();
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
