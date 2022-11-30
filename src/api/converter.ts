/**
 * Преобразует возвращаемы сервером данные в модель User
 *
 * @format
 * @data data данные которые возвращает сервер
 */

import { Gender, SubscribeType } from "src/enum";
import { CanSerialization, State, SubscribeInformation } from "~types";
import { ServerEntities } from "./types";

export const toSubscribe = (
	data: ServerEntities.Subscribe
): SubscribeInformation & CanSerialization<SubscribeInformation> => {
	const type: SubscribeType =
		data.Type === "Month" ? SubscribeType.MONTH : data.Type === "Month6" ? SubscribeType.HALF_YEAR : SubscribeType.WEEK;
	const autoPayment = data.RebillId === -1;
	const whenSubscribe = new Date(data.WhenSubscribe);

	return {
		type,
		autoPayment,
		whenSubscribe,
		toSerialization: () => ({
			autoPayment,
			type,
			whenSubscribe: whenSubscribe.toISOString(),
		}),
	};
};

export const toPractice = (data: ServerEntities.Meditation) => {
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
};

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
