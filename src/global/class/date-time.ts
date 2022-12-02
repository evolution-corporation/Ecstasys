/** @format */

class DateTime extends Date {
	public static toDay() {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	}

	public static getStartWeek() {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - date.getDay());
		return date;
	}

	public static getStartMonth() {
		const date = new Date();
		date.setHours(23, 59, 59, 999);
		date.setDate(0);
		return date;
	}
}

export default DateTime;
