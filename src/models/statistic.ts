/** @format */
import * as Crypto from "expo-crypto";

import { State, StatisticPeriod } from "~types";
import { Storage } from "~api";
import StatisticUnit from "./statisticUnit";
import Practices from "./practices";

export default class Statistic {
	protected list: StatisticUnit[] = [];
	protected get lastIndex(): string {
		if (this.list.length > 0) {
			return this.list[this.list.length - 1].id;
		} else {
			return "0";
		}
	}

	public isLoaded: boolean = true;

	constructor(list: readonly StatisticUnit[]) {
		//вшиваем алгоритм сортировки
		function swap(noSortList: StatisticUnit[], leftIndex: number, rightIndex: number) {
			const temp = noSortList[leftIndex];
			noSortList[leftIndex] = noSortList[rightIndex];
			noSortList[rightIndex] = temp;
			return noSortList;
		}
		function partition(noSortList: StatisticUnit[], leftIndex: number, rightIndex: number): [StatisticUnit[], number] {
			const pivot = noSortList[Math.floor((rightIndex + leftIndex) / 2)].dateListen;
			let left = leftIndex;
			let right = rightIndex;

			while (left < right) {
				while (noSortList[left].dateListen < pivot) {
					left++;
				}
				while (noSortList[right].dateListen > pivot) {
					right--;
				}
				if (left <= right) {
					noSortList = swap(noSortList, left, right);
					left++;
					right--;
				}
			}
			return [noSortList, left];
		}
		function fastSort(
			listForSort: StatisticUnit[],
			leftIndex: number = 0,
			rightIndex: number = listForSort.length - 1
		) {
			let index: number;
			if (listForSort.length > 1) {
				[listForSort, index] = partition(listForSort, leftIndex, rightIndex);
				if (leftIndex < index - 1) {
					listForSort = fastSort(listForSort, leftIndex, index - 1);
				} else if (index < rightIndex) {
					listForSort = fastSort(listForSort, index, rightIndex);
				}
			}

			return listForSort;
		}
		this.list = fastSort([...list]);
	}

	public getState(): State.Statistic {
		return Object.fromEntries(this.list.map(unit => [unit.id, unit.getState()]));
	}

	public static createByState(state: State.Statistic): Statistic {
		return new Statistic(Object.entries(state).map(([key, stateUnit]) => StatisticUnit.createByState(stateUnit)));
	}

	public async addMeditation(meditation: Practices, timeListen: number): Promise<Statistic> {
		const statisticUnit = new StatisticUnit(
			await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, this.lastIndex),
			new Date(),
			timeListen,
			meditation
		);
		await Storage.addStatistic(
			statisticUnit.id,
			statisticUnit.timeListen,
			statisticUnit.dateListen,
			statisticUnit.meditation.id
		);
		this.list.push(statisticUnit);
		return this;
	}

	public async initialization(): Promise<Statistic> {
		this.isLoaded = false;
		const statistic = await Storage.getStatistic();
		const practices: Practices[] = [];
		this.list = [];
		for (let { date, id, meditationId, time } of statistic) {
			let practice: Practices | undefined = practices.find(({ id }) => meditationId === id);
			if (practice === undefined) {
				practice = (await Practices.getById(meditationId)) ?? undefined;
				if (practice !== undefined) practices.push(practice);
			}
			if (practice !== undefined) this.list.push(new StatisticUnit(id, new Date(date), time, practice));
		}
		this.isLoaded = false;
		return this;
	}

	public getStatistic(timePeriod: StatisticPeriod) {
		let statisticsUnit = [...this.list];
		if (timePeriod !== StatisticPeriod.ALL) {
			const timeLeft = new Date();
			timeLeft.setHours(0, 0, 0, 0);
			if (timePeriod === StatisticPeriod.WEEK) {
				timeLeft.setDate(timeLeft.getDate() - timeLeft.getDay());
			} else if (timePeriod === StatisticPeriod.MONTH) {
				timeLeft.setDate(0);
			}
			statisticsUnit = statisticsUnit.filter(staticUnit => staticUnit.dateListen > timeLeft);
		}

		return [
			statisticsUnit.length,
			statisticsUnit.reduce((value, statisticUnit) => statisticUnit.timeListen + value, 0),
		];
	}

	public getHistory(): Practices[] {
		return this.list.map(item => item.meditation);
	}
}
