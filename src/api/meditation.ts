import { PracticesMeditation } from "src/enum";
import { RequestError } from "src/Errors";
import { CanSerialization, DMDInformation, PracticeInformation, UserInformation } from "~types";
import Request from "./request";

class Meditation {
	public static getById = async (userId: string, options: { signal?: AbortSignal } = {}) => {
		try {
			const requestServer = await Request.get("users?id=" + userId, options.signal);
			if (requestServer.status === 404) {
				return;
			}
			if (requestServer.status >= 500) {
				throw new RequestError(`getUserById: ${await requestServer.text()}`, "", undefined, "GET", "50x");
			}
			return await requestServer.toUser();
		} catch (error) {
			if (error instanceof Error && error.name == "AbortError") {
			} else {
				throw error;
			}
		}
	};

	public static to = (data: MeditationServerEntities) => {
		const id = data.Id;
		const audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + data.AudioId;
		const isNeedSubscribe = data.IsSubscribed;
		const name = data.Name;
		const length = data.AudioLength;
		if (data.TypeMeditation === "Set") {
			return {
				id,
				audio,
				isNeedSubscribe,
				length,
				name,
				toSerialization: () => ({
					id,
					audio,
					isNeedSubscribe,
					length,
					name,
				}),
			} as DMDInformation & CanSerialization<DMDInformation>;
		}
		const description = data.Description;
		const image = "https://storage.yandexcloud.net/dmdmeditationimage/meditations/" + data.PhotoId;
		const instruction = {
			id: "",
			body: [],
			description: "",
			title: "",
		};
		const type =
			data.TypeMeditation === "BreathtakingPractice"
				? PracticesMeditation.BREATHING_PRACTICES
				: data.TypeMeditation === "DancePsychotechnics"
				? PracticesMeditation.DANCE_PSYCHOTECHNICS
				: data.TypeMeditation === "Relaxation"
				? PracticesMeditation.RELAXATION
				: PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
		return {
			id,
			description,
			isNeedSubscribe,
			name,
			length,
			image,
			instruction,
			type,
			toSerialization: () => ({
				id,
				description,
				isNeedSubscribe,
				name,
				length,
				image,
				instruction: instruction,
				type,
			}),
		} as PracticeInformation & CanSerialization<PracticeInformation>;
	};
}

Response.prototype.toMeditation = async function () {
	const data = await this.json();
	if (!data) {
		return;
	}
	return Meditation.to(data);
};

declare global {
	interface Response {
		toMeditation: () => Promise<Readonly<ReturnType<typeof Meditation.to>> | undefined>;
	}
}

export default Meditation;

export interface MeditationServerEntities {
	readonly Id: string;
	readonly Language?: string;
	readonly Name: string;
	readonly Description?: string;
	readonly TypeMeditation:
		| "Relaxation"
		| "BreathtakingPractice"
		| "DirectionalVisualizations"
		| "DancePsychotechnics"
		| "Set";
	readonly IsSubscribed: boolean;
	readonly AudioId?: string;
	readonly AudioLength: number;
	readonly PhotoId?: string;
}
