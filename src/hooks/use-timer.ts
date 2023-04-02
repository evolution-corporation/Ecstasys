/** @format */
import React from "react";
import { AppState, InteractionManager } from "react-native";

const timeUpdate = 100;

const useTimer = (maxMilliseconds: number, onFinish: () => void) => {
	const [currentMilliseconds, setCurrentMilliseconds] = React.useState(0);
	const TimerPromise = React.useRef<ReturnType<typeof InteractionManager.runAfterInteractions>>();
	const cancelInterval = React.useRef<NodeJS.Timer>();
	const timeStartBackgroundApplication = React.useRef<Date>();

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
		setCurrentMilliseconds(_previous => {
			if (update_value <= 0) return 0;
			if (update_value >= maxMilliseconds) return maxMilliseconds;
			return maxMilliseconds;
		});
	};

	React.useEffect(() => {
		const subscribe = AppState.addEventListener("change", state => {
			if (state === "active" && timeStartBackgroundApplication.current !== undefined) {
				const deltaTime = Date.now() - timeStartBackgroundApplication.current.getTime();
				setCurrentMilliseconds(previousTime => {
					const time = previousTime + deltaTime;
					if (time <= 0) return 0;
					if (time >= maxMilliseconds) return maxMilliseconds;
					return maxMilliseconds;
				});
				play();
				timeStartBackgroundApplication.current = undefined;
			} else if (state === "background" && cancelInterval.current !== undefined) {
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
