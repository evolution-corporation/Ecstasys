/** @format */
import { State } from "~types";
import Practices from "./practices";

export default class StatisticUnit {
	public readonly id: string;
	public readonly dateListen: Date;
	public readonly timeListen: number;
	public readonly meditation: Practices;

	constructor(id: string, dateListen: Date, timeListen: number, meditation: Practices) {
		if (dateListen > new Date()) throw new Error("Listening can't be in the future");
		this.id = id;
		this.dateListen = dateListen;
		this.meditation = meditation;
		this.timeListen = timeListen;
	}

	public getState(): State.StatisticUnit {
		return {
			id: this.id,
			dateListen: this.dateListen.toISOString(),
			timeListen: this.timeListen,
			meditation: this.meditation.getState(),
		};
	}

	public static createByState(state: State.StatisticUnit): StatisticUnit {
		return new StatisticUnit(
			state.id,
			new Date(state.dateListen),
			state.timeListen,
			Practices.createByState(state.meditation)
		);
	}
}
