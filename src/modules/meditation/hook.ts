import {useEffect, useMemo, useState} from "react";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {CountMeditationInWee, LengthMeditation, Meditation, MeditationPreferences, TypeMeditation} from "./types";
import {jsonRequest} from '~api'

export function useMeditationPreferences() {
	const [typesMeditation, setTypesMeditation] = useState<TypeMeditation[]>([])
	const [lengthMeditation, setLengthMeditation] = useState<LengthMeditation | null>(null)
	const [countMeditationInWeek, setCountMeditationInWeek] = useState<CountMeditationInWee | null>(null)
	const [isMeditationPreferences, setIsMeditationPreferences] = useState<boolean>(false)
	const { getItem, setItem, removeItem } = useAsyncStorage('@MeditationPreferences')

	useEffect(()=>{
		const initMeditationPreferences = async () => {
			const asyncStorage = await getItem()
			if (asyncStorage !== null) {
				let meditationPreferences: MeditationPreferences = JSON.parse(asyncStorage)
				setTypesMeditation(meditationPreferences.type)
				setLengthMeditation(meditationPreferences.length)
				setCountMeditationInWeek(meditationPreferences.countInWeek)
				setIsMeditationPreferences(true)
			}
		}
		initMeditationPreferences().catch(console.error)
	},[setCountMeditationInWeek, setLengthMeditation, setTypesMeditation])


	const func = useMemo(() => ({
		update: async (meditationPreferences: MeditationPreferences) => {
			setTypesMeditation(meditationPreferences.type)
			setLengthMeditation(meditationPreferences.length)
			setCountMeditationInWeek(meditationPreferences.countInWeek)
			setIsMeditationPreferences(true)
			await setItem(JSON.stringify(meditationPreferences))
		},
		remove: async () => {
			setTypesMeditation([])
			setCountMeditationInWeek(null)
			setLengthMeditation(null)
			setIsMeditationPreferences(false)
			await removeItem()
		},
		getMeditation: async () => {
			let preferences = 'preferences='
			if (isMeditationPreferences) {
				preferences += JSON.stringify({
					TypeMeditation: typesMeditation,
					CountDayMeditation: countMeditationInWeek,
					TimeMeditation:lengthMeditation
				})
			} else {
			preferences += 'random'
			}
			return await jsonRequest('meditation', preferences) as Meditation
		}
	}), [typesMeditation, lengthMeditation, countMeditationInWeek, isMeditationPreferences])

	return {
		meditationPreferences: {
			typesMeditation, lengthMeditation, countMeditationInWeek
		},
		isMeditationPreferences,
		update: func.update,
		remove: func.remove,
		getRecommendationMeditation: func.getMeditation
	}
}

export function usePopularMeditation() {
	const [popularMeditation, setPopularMeditation] = useState<Meditation>()
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(()=>{
		const init = async () => {
			const request = await jsonRequest('meditation', 'popularToDay')
			setPopularMeditation(request as Meditation)
			setIsLoading(false)
		}
		init().catch(console.error)
	},[setPopularMeditation])

	return {
		popularMeditation,
		isLoading
	}
}