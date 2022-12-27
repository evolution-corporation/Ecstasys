/** @format */

import type { ExpoConfig } from "expo/config";
import { version } from "./package.json";

function generateConfig(): ExpoConfig {
	const appName = process.env.APP_VARIANT !== "dev" ? "dmd meditation" : "DMD Dev";
	const appUrl =
		process.env.APP_VARIANT !== "dev" ? "com.evodigital.dmdmeditation" : "com.evodigital.dmdmeditation_dev";
	const apiURL =
		process.env.APP_VARIANT === "prod"
			? "api.evodigital.one"
			: process.env.APP_VARIANT === "beta"
			? "beta.api.evodigital.one"
			: "dev.api.evodigital.one";

	const toDay = new Date();
	const date = {
		date: toDay.getDate() < 10 ? "0" + toDay.getDate() : toDay.getDate(),
		month: toDay.getMonth() < 10 ? "0" + toDay.getMonth() : toDay.getMonth(),
		year: toDay.getFullYear(),
	};
	let versionCode = Number(`${date.year}${date.month}${date.date}0`);
	versionCode += 2;
	return {
		jsEngine: "hermes",
		name: appName,
		owner: "evo_digital",
		slug: "dmd-meditation",
		privacy: process.env.APP_VARIANT !== "dev" ? "public" : "hidden",
		description: "Авторские медитации и дыхательные практики от профессора психологии Козлова В.В.",
		version,
		orientation: "portrait",
		githubUrl: "https://github.com/evolution-corporation/dmd-meditation",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#FFFFFF",
		},
		updates: {
			fallbackToCacheTimeout: 0,
			url: "https://u.expo.dev/ca80bcb8-c749-4c34-ac86-5685e4da70ed",
		},
		assetBundlePatterns: ["**/*"],
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#FFFFFF",
			},
			icon: "./assets/icon.png",
			package: appUrl,
			googleServicesFile: "./google-services.json",
			permissions: ["android.permission.RECORD_AUDIO"],
			versionCode,
		},
		ios: {
			googleServicesFile: "./GoogleService-Info.plist",
			bundleIdentifier: "com.evodigital.dmdmeditation",
			buildNumber: versionCode.toString(),
			infoPlist: {
				UIBackgroundModes: ["audio"],
			},
		},
		plugins: [
			"expo-dev-client",
			"expo-splash-screen",
			"expo-image-picker",
			"expo-av",
			"expo-updates",
			"@react-native-firebase/app",
			"expo-notifications",
			"@react-native-google-signin/google-signin",
			[
				"expo-build-properties",
				{
					ios: {
						useFrameworks: "static",
					},
				},
			],
		],
		extra: {
			eas: {
				projectId: "ca80bcb8-c749-4c34-ac86-5685e4da70ed",
			},
			isDebug: process.env.APP_VARIANT !== "dev",
			apiURL,
			GoogleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
		},
		runtimeVersion: {
			policy: "sdkVersion",
		},
	};
}

export default generateConfig();
