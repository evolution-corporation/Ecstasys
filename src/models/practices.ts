/** @format */

import { SupportType } from "src/api/types";
import { Request } from "~api";
import { PracticesMeditation, State } from "~types";
import Instructions from "./instruction";
import { Audio, AVPlaybackStatus } from "expo-av";

/** Хранит в себе информацию об практике */
export default class Practices {
	/** Уникальный идентификатор медитационной практики */
	public readonly id: string;
	/** Название практики */
	public readonly name: string;
	/** Тип практики */
	public readonly type: PracticesMeditation;
	/** Ссылка на фоновое изображение практики */
	public readonly image: string;
	/** Описание практики */
	public readonly description: string;
	/** Ссылка на главный аудио трек */
	public readonly audio?: string;
	/** Требуется ли подписка для прослушивания данной медитации */
	public readonly isNeedSubscribe?: boolean;
	/** Инструкция к данной медитации */
	public readonly instruction: Instructions;

	//!
	public readonly length: number;
	constructor(
		id: string,
		name: string,
		type: PracticesMeditation,
		image: string,
		description: string,
		length: number,
		isNeedSubscribe: boolean = true,
		audio?: string,
		instruction?: Instructions
	) {
		this.id = id;
		this.description = description;
		this.image = image;
		this.name = name;
		this.isNeedSubscribe = isNeedSubscribe;
		this.audio = audio;
		this.type = type;
		this.length = length;
		switch (type) {
			case PracticesMeditation.BREATHING_PRACTICES:
				this.instruction = Instructions.getForRelaxation(); // ! Исправить когда разберемся с инструкциями
				break;
			case PracticesMeditation.DANCE_PSYCHOTECHNICS:
				this.instruction = Instructions.getForRelaxation(); // ! Исправить когда разберемся с инструкциями
				break;
			case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
				this.instruction = Instructions.getForDirectionalVisualization();
				break;
			case PracticesMeditation.RELAXATION:
				this.instruction = Instructions.getForRelaxation();
				break;
			default:
				throw new Error(`Not found ${type} in PracticesMeditation`);
		}
	}
	// TODO добавить работу с аудио плеером
	getState(): State.Practice {
		let type: State.PracticesMeditation;
		switch (this.type) {
			case PracticesMeditation.BASIC:
				type = "BASIC";
				break;
			case PracticesMeditation.BREATHING_PRACTICES:
				type = "BREATHING_PRACTICES";
				break;
			case PracticesMeditation.DANCE_PSYCHOTECHNICS:
				type = "DANCE_PSYCHOTECHNICS";
				break;
			case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
				type = "DIRECTIONAL_VISUALIZATIONS";
				break;
			case PracticesMeditation.RELAXATION:
				type = "RELAXATION";
				break;
			default:
				throw new Error(`Not found Need Type: ${this.type}`);
		}
		return {
			id: this.id,
			description: this.description,
			name: this.name,
			instruction: this.instruction.getState(),
			image: this.image,
			type,
			audio: this.audio,
			isNeedSubscribe: this.isNeedSubscribe ?? true,
			length: this.length,
		};
	}

	static createByState(state: State.Practice) {
		let type: PracticesMeditation;
		switch (state.type) {
			case "BASIC":
				type = PracticesMeditation.BASIC;
				break;
			case "BREATHING_PRACTICES":
				type = PracticesMeditation.BREATHING_PRACTICES;
				break;
			case "DANCE_PSYCHOTECHNICS":
				type = PracticesMeditation.DANCE_PSYCHOTECHNICS;
				break;
			case "DIRECTIONAL_VISUALIZATIONS":
				type = PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
				break;
			case "RELAXATION":
				type = PracticesMeditation.RELAXATION;
				break;
			default:
				throw new Error(`Not found Need Type: ${state.type}`);
		}
		return new Practices(
			state.id,
			state.name,
			type,
			state.image,
			state.description,
			state.length,
			state.isNeedSubscribe,
			state.audio,
			Instructions.createByState(state.instruction)
		);
	}

	public static async getById(id: string): Promise<null | Practices> {
		const practice = await Request.getMeditationById(id);
		if (practice === null) {
			return null;
		} else {
			let typePractices: PracticesMeditation;
			switch (practice.TypeMeditation) {
				case "relaxation":
					typePractices = PracticesMeditation.RELAXATION;
					break;
				case "breathingPractices":
					typePractices = PracticesMeditation.BREATHING_PRACTICES;
					break;
				case "dancePsychotechnics":
					typePractices = PracticesMeditation.DANCE_PSYCHOTECHNICS;
					break;
				case "directionalVisualizations":
					typePractices = PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
					break;
				default:
					throw new Error(`Not found ${practice.TypeMeditation} in PracticesMeditation`);
			}
			const image = "https://storage.yandexcloud.net/dmdmeditationimage/meditations/" + practice.id;
			let audio: string | undefined;
			if (practice.HasAudio) {
				audio = "https://storage.yandexcloud.net/dmdmeditatonaudio/" + practice.id;
			}
			if (practice.Description === undefined) {
				throw new Error(`Not found description in practices. MeditationID: ${practice.id}`);
			}
			return new Practices(
				practice.id,
				practice.Name,
				typePractices,
				image,
				practice.Description,
				practice.AudioLength,
				practice.IsSubscribed,
				audio
				// ! инструкции
			);
		}
	}

	public static async getCountPractice(practiceType: PracticesMeditation): Promise<number> {
		let type: SupportType.TypeMeditation;
		switch (practiceType) {
			case PracticesMeditation.BASIC:
				return 0;
				break;
			case PracticesMeditation.BREATHING_PRACTICES:
				type = "breathingPractices";
				break;
			case PracticesMeditation.DANCE_PSYCHOTECHNICS:
				type = "dancePsychotechnics";
				break;
			case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
				type = "directionalVisualizations";
				break;
			case PracticesMeditation.RELAXATION:
				type = "relaxation";
				break;
		}
		//dev
		return 10; // await Request.getCountMeditationsByType(type);
	}

	public static convertCount(countPractice: { [key in State.PracticesMeditation]: number }): {
		[key in PracticesMeditation]: number;
	} {
		return {
			basic: countPractice.BASIC,
			breathingPractices: countPractice.BREATHING_PRACTICES,
			dancePsychotechnics: countPractice.DANCE_PSYCHOTECHNICS,
			directionalVisualizations: countPractice.DIRECTIONAL_VISUALIZATIONS,
			relaxation: countPractice.RELAXATION,
		};
	}

	public static async getByType(type: PracticesMeditation) {
		return [
			{
				id: "94413433-13bf-4569-846b-974f428bc673",
				Description: "test",
				Name: "rest",
				TypeMeditation: "relaxation",
				instruction: { id: "123", body: [], title: "123312", description: "asdasd" },
				IsSubscribed: true,
				AudioLength: 212000,
				HasAudio: true,
			},
			{
				id: "11233122",
				Description:
					"asadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasa",
				image:
					"https://storage.yandexcloud.net/dmdmeditationimage/meditations/d76cb078-7cdd-43d2-bfda-6eaa3be04fde.png",
				Name: "ressadadst",
				TypeMeditation: "relaxation",
				instruction: { id: "123", body: [], title: "123312", description: "asdasd" },
				IsSubscribed: false,
				AudioLength: 300000,
				HasAudio: true,
			},
			{
				id: "1122",
				Description: "tesasdast",
				image:
					"https://storage.yandexcloud.net/dmdmeditationimage/meditations/f5d9af34-08f2-446c-b9f5-f57f7acaae2d.png",
				Name: "resvcxvzt",
				TypeMeditation: "relaxation",
				instruction: { id: "123", body: [], title: "123312", description: "asdasd" },
				HasAudio: true,
				IsSubscribed: true,
				AudioLength: 600000,
			},
			{
				id: "1121322",
				Description: "tesaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdast",
				image:
					"https://storage.yandexcloud.net/dmdmeditationimage/meditations/f5d9af34-08f2-446c-b9f5-f57f7acaae2d.png",
				Name: "asadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasa",
				TypeMeditation: "relaxation",
				instruction: { id: "123", body: [], title: "123312", description: "asdasd" },
				HasAudio: true,
				IsSubscribed: true,
				AudioLength: 6000000,
			},
		].map(
			practiceData =>
				new Practices(
					practiceData.id,
					practiceData.Name,
					(() => {
						switch (practiceData.TypeMeditation) {
							case "relaxation":
								return PracticesMeditation.RELAXATION;
							case "directionalVisualizations":
								return PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
							case "dancePsychotechnics":
								return PracticesMeditation.DANCE_PSYCHOTECHNICS;
							case "breathingPractices":
								return PracticesMeditation.BREATHING_PRACTICES;
							default:
								throw new Error("NotFoundNeed Type");
						}
					})(),
					`https://storage.yandexcloud.net/dmdmeditationimage/meditations/${practiceData.id}.png`,
					practiceData.Description === undefined
						? (() => {
								throw new Error("not Found Description");
						  })()
						: practiceData.Description,
					practiceData.AudioLength,
					practiceData.IsSubscribed,
					practiceData.HasAudio ? `https://storage.yandexcloud.net/dmdmeditatonaudio/${practiceData.id}.mp3` : undefined
				)
		);

		if (type === PracticesMeditation.BASIC) {
			return [];
		} else {
			return (
				await Request.getMeditationsByType(
					(() => {
						switch (type) {
							case PracticesMeditation.BREATHING_PRACTICES:
								return "breathingPractices";
							case PracticesMeditation.DANCE_PSYCHOTECHNICS:
								return "dancePsychotechnics";
							case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
								return "directionalVisualizations";
							case PracticesMeditation.RELAXATION:
								return "relaxation";
						}
					})()
				)
			).map(
				practiceData =>
					new Practices(
						practiceData.id,
						practiceData.Name,
						(() => {
							switch (practiceData.TypeMeditation) {
								case "relaxation":
									return PracticesMeditation.RELAXATION;
								case "directionalVisualizations":
									return PracticesMeditation.DIRECTIONAL_VISUALIZATIONS;
								case "dancePsychotechnics":
									return PracticesMeditation.DANCE_PSYCHOTECHNICS;
								case "breathingPractices":
									return PracticesMeditation.BREATHING_PRACTICES;
								default:
									throw new Error("NotFoundNeed Type");
							}
						})(),
						`https://storage.yandexcloud.net/dmdmeditationimage/meditations/${practiceData.id}.png`,
						practiceData.Description === undefined
							? (() => {
									throw new Error("not Found Description");
							  })()
							: practiceData.Description,
						practiceData.AudioLength,
						practiceData.IsSubscribed,
						practiceData.HasAudio
							? `https://storage.yandexcloud.net/dmdmeditatonaudio/${practiceData.id}.mp3`
							: undefined
					)
			);
		}
	}
}

export const BackgroundSound = {
	thunderstorm: {
		image: require("assets/backgroundMusic/image/thunderstorm.png"),
		audio: require("assets/backgroundMusic/sound/thunderstorm.mp3"),
		translate: "10196d40-2dcd-48c9-a070-3b8f9b264df6",
	},
	waterfall: {
		image: require("assets/backgroundMusic/image/waterfall.png"),
		audio: require("assets/backgroundMusic/sound/waterfall.mp3"),
		translate: "cd529b21-208b-4103-94ab-ee84b9845cd0",
	},
};

export async function playFragmentMeditationBackground(name: keyof typeof BackgroundSound) {
	const sound = (
		await Audio.Sound.createAsync(BackgroundSound[name].audio, {
			isLooping: true,
		})
	).sound;
	await sound.playAsync();
	const off = async () => {
		await sound.stopAsync();
	};
	setTimeout(() => off(), 15000);
	return off;
}
