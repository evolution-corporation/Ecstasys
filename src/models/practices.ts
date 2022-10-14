/** @format */

import { Request } from "~api";
import { PracticesMeditation, State } from "~types";
import Instructions from "./instruction";

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

	constructor(
		id: string,
		name: string,
		type: PracticesMeditation,
		image: string,
		description: string,
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
				practice.IsSubscribed,
				audio
				// ! инструкции
			);
		}
	}
}
