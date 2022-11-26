/** @format */

import { SupportType } from "src/api/types";
import { Request } from "~api";
import { State, SubscribeType } from "~types";

export default class Subscribe {
	public whenSubscribe: Date;
	public type: SubscribeType;
	public autoPayment: boolean;

	public get isActivate() {
		if (this.endSubscribe > new Date()) {
			return true;
		}
		return false;
	}

	public get endSubscribe() {
		let endSubscribe = new Date(this.whenSubscribe);
		switch (this.type) {
			case SubscribeType.WEEK:
				endSubscribe.setDate(endSubscribe.getDate() + 7);
				break;
			case SubscribeType.MONTH:
				endSubscribe.setDate(endSubscribe.getDate() + 30);
				break;
			case SubscribeType.HALF_YEAR:
				endSubscribe.setDate(endSubscribe.getDate() + 180);
		}
		return endSubscribe;
	}

	constructor(type: SubscribeType, whenSubscribe: Date, autoPayment: boolean = false) {
		this.whenSubscribe = whenSubscribe;
		this.type = type;
		this.autoPayment = autoPayment;
	}

	public getState(): State.Subscribe {
		let subscribeType: State.SubscribeType;
		switch (this.type) {
			case SubscribeType.WEEK:
				subscribeType = "WEEK";
				break;
			case SubscribeType.MONTH:
				subscribeType = "MONTH";
				break;
			case SubscribeType.HALF_YEAR:
				subscribeType = "HALF_YEAR";
				break;
		}
		return {
			type: subscribeType,
			whenSubscribe: this.whenSubscribe.toISOString(),
			autoPayment: this.autoPayment,
		};
	}

	public static createByState(state: State.Subscribe) {
		let type: SubscribeType;
		switch (state.type) {
			case "WEEK":
				type = SubscribeType.WEEK;
				break;
			case "MONTH":
				type = SubscribeType.MONTH;
				break;
			case "HALF_YEAR":
				type = SubscribeType.HALF_YEAR;
				break;
		}
		return new Subscribe(type, new Date(state.whenSubscribe), state.autoPayment);
	}

	public static async getSubscribe(): Promise<Subscribe | null> {
		const subscribeData = await Request.getSubscribeUserInformation();
		if (subscribeData === null) return null;
		let type: SubscribeType;
		switch (subscribeData.Type) {
			case "Week":
				type = SubscribeType.WEEK;
				break;
			case "Month":
				type = SubscribeType.MONTH;
				break;
			case "Month6":
				type = SubscribeType.HALF_YEAR;
				break;
		}
		return new Subscribe(type, new Date(subscribeData.WhenSubscribe), subscribeData.RebillId !== -1);
	}

	public static async create(type: SubscribeType): Promise<string> {
		let subscribeType: SupportType.SubscribeType;
		switch (type) {
			case SubscribeType.WEEK:
				subscribeType = "Week";
				break;
			case SubscribeType.MONTH:
				subscribeType = "Month";
				break;
			case SubscribeType.HALF_YEAR:
				subscribeType = "Month6";
				break;
		}
		const urlPayment = await Request.getPaymentURL(subscribeType);
		return urlPayment;
	}
}
