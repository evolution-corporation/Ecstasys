/** @format */

import { Audio, AVPlaybackStatus } from "expo-av";

const BackgroundSound = {
	// thunderstorm: {
	// 	image: require("../assets/backgroundMusic/image/thunderstorm.png"),
	// 	audio: require("../assets/backgroundMusic/sound/thunderstorm.mp3"),
	// 	translate: "10196d40-2dcd-48c9-a070-3b8f9b264df6",
	// },
	// waterfall: {
	// 	image: require("../assets/backgroundMusic/image/waterfall.png"),
	// 	audio: require("../assets/backgroundMusic/sound/waterfall.mp3"),
	// 	translate: "cd529b21-208b-4103-94ab-ee84b9845cd0",
	// },
	//дождь, огонь, река, лес - rain, fire, river, forest
	rain: {
		image: require("../assets/backgroundMusic/image/rain.png"),
		audio: {
			uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/Background/%D0%94%D0%BE%D0%B6%D0%B4%D1%8C%20%2B%20%D0%B3%D1%80%D0%BE%D0%B7%D0%B0.mp3",
		},
		translate: "0a61e4e9-fbcc-428a-99ef-7172d276b2d8",
	},
	fire: {
		image: require("../assets/backgroundMusic/image/fire.png"),
		audio: {
			uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/Background/%D0%A2%D0%B5%D0%BF%D0%BB%D0%BE%20%D0%BE%D0%B3%D0%BD%D1%8F.mp3",
		},
		translate: "4d6df190-7668-47a6-8f16-7d2882a60df7",
	},
	river: {
		image: require("../assets/backgroundMusic/image/river.png"),
		audio: {
			uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/Background/%D0%96%D1%83%D1%80%D1%87%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%A0%D1%83%D1%87%D1%8C%D1%8F.mp3",
		},
		translate: "245a500f-3b28-46c5-99d2-3203da4ea156",
	},
	forest: {
		image: require("../assets/backgroundMusic/image/forest.png"),
		audio: {
			uri: "https://storage.yandexcloud.net/dmdmeditatonaudio/Background/%D0%9F%D1%80%D0%BE%D0%B3%D1%83%D0%BB%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%BB%D0%B5%D1%81%D1%83.mp3",
		},
		translate: "e9f3ecb5-cf2f-4f34-819e-6da036952250",
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

export default BackgroundSound;
