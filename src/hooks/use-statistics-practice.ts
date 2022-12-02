/** @format */

import DateTime from "src/global/class/date-time";
import { useAppSelector } from "~store";

export enum TimePeriod {
	week,
	month,
	all,
}

const useStaticPractice = (timePeriod: TimePeriod) => {
	const listPractices = useAppSelector(store => store.practice.listPracticesListened);

	const filterStatic = listPractices.filter(({ dateListen }) => {
		const dateTimeListen = new DateTime(dateListen);
		switch (timePeriod) {
			case TimePeriod.week: {
				return dateTimeListen >= DateTime.getStartWeek();
			}
			case TimePeriod.month: {
				return dateTimeListen >= DateTime.getStartMonth();
			}
			default: {
				return true;
			}
		}
	});

	const timeListen = filterStatic.reduce((currentTimeListen, { msListened }) => currentTimeListen + msListened, 0);

	return { list: filterStatic, length: filterStatic.length, timeLength: timeListen };
};

export default useStaticPractice;
