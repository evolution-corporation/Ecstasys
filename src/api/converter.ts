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
	if (data.PhotoId) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/" + data.PhotoId + '.png';
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
			case "Relaxation":
				typePractices = "RELAXATION";
				break;
			case "BreathtakingPractice":
				typePractices = "BREATHING_PRACTICES";
				break;
			case "DancePsychotechnics":
				typePractices = "DANCE_PSYCHOTECHNICS";
				break;
			case "DirectionalVisualizations":
				typePractices = "DIRECTIONAL_VISUALIZATIONS";
				break;
			default:
				throw new Error(`Not found ${data.TypeMeditation} in PracticesMeditation`);
		}
		const image = "https://storage.yandexcloud.net/dmdmeditationimage/meditations/" + data.PhotoId;

		let audio: string | undefined;
		if (data.AudioId) {
			audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + data.AudioId;
		}
		if (data.Description === undefined) {
			throw new Error(`Not found description in practices. MeditationID: ${data.Id}`);
		}
		return {
			image: image,
			description: data.Description,
			id: data.Id,
			name: data.Name,
			audio: audio,
			type: typePractices,
			isNeedSubscribe: data.IsSubscribed,
			instruction: { body: [], description: "", id: "", title: "" },
			length: data.AudioLength,
		};
	}
}

export function composeSet(data: (ServerEntities.Meditation & { TypeMeditation: "Set" }) | null): State.Set | null {
	if (data === null) {
		return null;
	} else {
		if (data.AudioId === undefined) throw new Error("Not Found AudioID");
		let audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + data.AudioId + ".mp3";

		return {
			id: data.Id,
			name: data.Name,
			audio: audio,
			length: data.AudioLength,
		};
	}
}
