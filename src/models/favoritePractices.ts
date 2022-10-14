/** @format */
import { SupportType } from "src/api/types";
import { Storage } from "~api";
import { PracticesMeditation, State } from "~types";
import { Practice } from ".";
import Practices from "./practices";

export default class Favorite {
	public list: Practices[] = [];

	constructor(listPractices: Practices[]) {
		this.list = listPractices;
	}

	public getState(): State.FavoritePractices {
		return this.list.map(practice => practice.getState());
	}

	public static createByState(state: State.FavoritePractices) {
		return new Favorite(state.map(practiceState => Practices.createByState(practiceState)));
	}

	public getListPracticesType() {
		const practicesType: PracticesMeditation[] = [];
		for (let practice of this.list) {
			if (!practicesType.includes(practice.type)) {
				practicesType.push(practice.type);
			}
		}
		return practicesType;
	}

	public getListPracticesByType(type: PracticesMeditation) {
		return [...this.list.filter(practice => practice.type === type)];
	}

	public async addPractice(practice: Practices) {
		if (this.list.findIndex(practiceFavorite => practice.id === practiceFavorite.id) === -1) {
			let type: SupportType.TypeMeditation;
			switch (practice.type) {
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
				default:
					throw new Error(`It is impossible to add meditation with type ${practice.type} to the chosen one`);
			}
			await Storage.addFavoriteMeditationPractices(
				practice.id,
				practice.name,
				practice.description,
				type,
				0,
				practice.audio
			);
			this.list = [...this.list, practice];
		}
		return this;
	}

	public async removePractice(practice: Practices) {
		if (this.list.findIndex(practiceFavorite => practice.id === practiceFavorite.id) !== -1) {
			await Storage.removeFavoriteMeditationPractices(practice.id);
			this.list = [...this.list.filter(practiceFavorite => practiceFavorite.id === practice.id)];
		}
		return this;
	}

	public async initialization() {
		const listPractices = await Storage.getFavoriteMeditationPractices();
		for (let practiceData of listPractices) {
			const practice = await Practices.getById(practiceData.id);
			if (practice !== null) this.list.push(practice);
		}
		return this;
	}
}
