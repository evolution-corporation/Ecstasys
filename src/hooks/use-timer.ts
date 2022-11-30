import React from "react";
import { InteractionManager } from "react-native";

const useTimer = (onChange: () => Promise<void>) => {
	const taskClear = React.useRef<() => void>();

	const start = async () => {
		let timer: NodeJS.Timer;
		const task = InteractionManager.runAfterInteractions(() => {
			timer = setInterval(() => onChange(), 100);
		});
		taskClear.current = () => {
			task.cancel();
			clearInterval(timer);
		};
	};

	const pause = async () => {
		if (taskClear.current) taskClear.current();
	};

	React.useEffect(() => {
		return () => {
			pause();
		};
	}, []);

	return { start, pause };
};

export default useTimer;
