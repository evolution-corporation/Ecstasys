/** @format */

import { Storage } from "~api";
import { State } from "~types";
import MessageId from "~assets/messageProfessor.json";

export default class MessageProfessor {
	public messageId: string;
	private dateTimeLastUpdate: Date;

	constructor(id: string, dateTimeLastUpdate?: Date) {
		this.messageId = id;
		this.dateTimeLastUpdate = dateTimeLastUpdate ?? new Date();
	}

	public getState(): State.MessageProfessor {
		return {
			dateTimeLastUpdate: this.dateTimeLastUpdate.toISOString(),
			idMessage: this.messageId,
		};
	}

	public static createByState(state: State.MessageProfessor) {
		return new MessageProfessor(state.idMessage, new Date(state.dateTimeLastUpdate));
	}

	private static async getLastMessage(): Promise<{ id: string; messageId: string; lastUpdate: Date } | null> {
		const listUsedMessage = await Storage.getUsingMessages();
		if (listUsedMessage.length === 0) return null;
		const lastMessage = listUsedMessage[listUsedMessage.length - 1];
		return { id: lastMessage.id, messageId: lastMessage.messageId, lastUpdate: new Date(lastMessage.dateLastUpdate) };
	}

	private static async getNewMessage() {
		const startMonth = new Date();
		startMonth.setHours(0, 0, 0, 0);
		startMonth.setDate(0);
		const listUsedMessage = (await Storage.getUsingMessages()).filter(
			messageData => new Date(messageData.dateLastUpdate) > startMonth
		);

		if (listUsedMessage.length > 0) {
			const listMessageId = listUsedMessage.map(item => item.id);
			const listNoShowMessage = MessageId.filter(messageId => !listMessageId.includes(messageId));
			return listNoShowMessage[Math.floor(Math.random() * listNoShowMessage.length)];
		}
		return MessageId[Math.floor(Math.random() * MessageId.length)];
	}

	public static async initialization() {
		const toDay = new Date();
		toDay.setHours(0, 0, 0, 0);
		let messageId: string;
		let dateTimeLastUpdate: Date;
		const lastMessage = await MessageProfessor.getLastMessage();
		if (lastMessage !== null && lastMessage.lastUpdate > toDay) {
			messageId = lastMessage.messageId;
			dateTimeLastUpdate = lastMessage.lastUpdate;
		} else {
			messageId = await MessageProfessor.getNewMessage();
			dateTimeLastUpdate = new Date();
		}
		return new MessageProfessor(messageId, dateTimeLastUpdate);
	}

	public getMessage(): [string, string | null] {
		const message = this.messageId;
		let greeting: string | null = null;
		const dateTimeNoShowGreeting = new Date();
		dateTimeNoShowGreeting.setMinutes(this.dateTimeLastUpdate.getMinutes() + 5);
		const currentDateTime = new Date();
		function dateTimeBetweenHorses(leftHors: number, rightHors: number) {
			return (
				currentDateTime.getHours() >= leftHors &&
				currentDateTime.getHours() < rightHors &&
				dateTimeNoShowGreeting > currentDateTime
			);
		}
		if (dateTimeBetweenHorses(0, 6) && this.dateTimeLastUpdate.getHours() < 6) {
			greeting = "06c305e9-2d05-4465-a0bf-8baa0de88baf";
		} else if (dateTimeBetweenHorses(6, 12)) {
			greeting = "a6c20644-393e-410d-9d76-b5859128a20e";
		} else if (dateTimeBetweenHorses(12, 18)) {
			greeting = "469021f2-3e5c-4cee-b33a-ffd1bb12a7ef";
		} else if (dateTimeBetweenHorses(18, 23)) {
			greeting = "52a1a44e-d621-4d55-b0df-b21ddea89872";
		}
		return [message, greeting];
	}
}
