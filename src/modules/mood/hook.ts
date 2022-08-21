import { useEffect, useMemo, useReducer, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { UserMood } from './types'

function getTimeStartMoodDay() {
	const timeStartMoodDay = new Date()
	timeStartMoodDay.setHours(8, 0, 0, 0)
	return timeStartMoodDay
}

export function useMood() {
	const { getItem, setItem } = useAsyncStorage('@Mood') // {  }
	const [moodList, setMoodList] = useState<UserMood[]>([])
	const moodScore = useMemo(()=>{
		let score = null
		for (let mood of moodList) {
			if (score === null) {
				score = 0
			}
			switch (mood) {
				case "ANXIETY":
				case "FATIGUE":
				case "ABSENTMINDEDNESS":
					score += 50;
					break;
				case "PACIFICATION":
				case "CONCENTRATION":
				case "HAPPINESS":
					score += 100;
					break;
				case "SADNESS":
				case "IRRITATION":
					score += 40;
					break;
			}
		}
		if (score !== null) {
			score = score / moodList.length
		}
		return score
	},[moodList])

	useEffect(()=>{
		const initMood = async () => {
			let asyncStorageMood: AsyncStorageMood = { listMood: [], timeLastSet: new Date() }
			const AsyncStorage = await getItem()
			if (AsyncStorage !== null) {
				asyncStorageMood = {
					listMood: JSON.parse(AsyncStorage).listMood,
					timeLastSet: new Date(JSON.parse(AsyncStorage).timeLastSet)
				}
				if (asyncStorageMood.timeLastSet.getTime() < getTimeStartMoodDay().getTime()) {
					asyncStorageMood.listMood = []
					asyncStorageMood.timeLastSet = new Date()
				}
			}
			setMoodList(asyncStorageMood.listMood)
		}
		initMood().catch(console.error)
	},[setMoodList])

	const func = useMemo(()=>({
		add: async (mood: UserMood) => {
			const newMoodList = [...moodList, mood]
			setMoodList(newMoodList)
			await setItem(JSON.stringify({
				listMood: newMoodList,
				timeLastSet: new Date()
			}))
		}
	}), [moodList])


	return {
		lastMood: moodList.length > 0 ? moodList[moodList.length - 1] : null,
		moodScore,
		addMood: func.add
	}
}

interface AsyncStorageMood {
	listMood: []
	timeLastSet: Date
}