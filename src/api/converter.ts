/**
 * Преобразует возвращаемы сервером данные в модель User
 *
 * @format
 * @data data данные которые возвращает сервер
 */

import { State } from "~types";
import { ServerEntities } from "./types";

export function composeUser(data: ServerEntities.User | null): State.User | null {
	if (data === null) return null;
	let image = "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";
	if (data.HasPhoto) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/" + data.Id;
	return {
		uid: data.Id,
		birthday: data.Birthday,
		displayName: data.DisplayName,
		image: image,
		gender: data.Gender,
		nickName: data.NickName,
	};
}

export function composeSubscribe(data: ServerEntities.Subscribe | null): State.Subscribe | null {
	if (data === null) return null;
	let type: State.SubscribeType;
	switch (data.Type) {
		case "Week":
			type = "WEEK";
			break;
		case "Month":
			type = "MONTH";
			break;
		case "Month6":
			type = "HALF_YEAR";
			break;
	}
	return {
		type: type,
		autoPayment: data.RebillId === -1,
		whenSubscribe: data.WhenSubscribe,
	};
}

export function composePractice(data: ServerEntities.Meditation | null): State.Practice | null {
	if (data === null) {
		return null;
	} else {
		let typePractices: State.PracticesMeditation;
		switch (data.TypeMeditation) {
			case "relaxation":
				typePractices = "RELAXATION";
				break;
			case "breathingPractices":
				typePractices = "BREATHING_PRACTICES";
				break;
			case "dancePsychotechnics":
				typePractices = "DANCE_PSYCHOTECHNICS";
				break;
			case "directionalVisualizations":
				typePractices = "DIRECTIONAL_VISUALIZATIONS";
				break;
			default:
				throw new Error(`Not found ${data.TypeMeditation} in PracticesMeditation`);
		}
		const image = "https://storage.yandexcloud.net/dmdmeditationimage/meditations/" + data.id;
		let audio: string | undefined;
		if (data.HasAudio) {
			audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + data.id;
		}
		if (data.Description === undefined) {
			throw new Error(`Not found description in practices. MeditationID: ${data.id}`);
		}
		return {
			image: image,
			description: data.Description,
			id: data.id,
			name: data.Name,
			audio: audio,
			type: typePractices,
			isNeedSubscribe: data.IsSubscribed,
			instruction: { body: [], description: "", id: "", title: "" },
			length: data.AudioLength,
		};
	}
}
