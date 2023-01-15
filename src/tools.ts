/** @format */
import * as FileSystem from "expo-file-system";
import { isNicknameValidate } from "src/validators";
import { Request } from "~api";

export function createArrayLength(len: number): null[] {
	const arr = [];
	for (let i = 0; i < len; i++) {
		arr.push(null);
	}
	return arr;
}

export async function generateNickname(
	nickname: string,
	nicknameList: string[] = [],
	templateNoUsed = [...templateOriginal]
): Promise<string[]> {
	if (nicknameList.length >= 5 || templateNoUsed.length == 0) {
		return nicknameList;
	}
	const variableIndex = Math.floor(Math.random() * templateNoUsed.length);
	const variableNickname = templateNoUsed.splice(variableIndex, 1)[0](nickname);
	if (true) {
		nicknameList.push(variableNickname);
	}
	return await generateNickname(nickname, [...nicknameList], [...templateNoUsed]);
}

const templateOriginal: ((nickname: string) => string)[] = [
	nickname => `${nickname}_1`,
	nickname => `${nickname}_2`,
	nickname => `${nickname}_3`,
	nickname => `${nickname}_4`,
	nickname => `${nickname}_5`,
	nickname => `${nickname}_6`,
	nickname => `${nickname}_7`,
	nickname => `${nickname}_8`,
	nickname => `${nickname}_9`,
	nickname => `${nickname}_10`,
];

type ConvertedDisplayName = string | null;
export function converterDisplayNameToNickname(displayName: string): ConvertedDisplayName {
	let nickname: string | null = displayName.toLowerCase().replaceAll("  ", " ").trim().replaceAll(" ", "_");

	if (nickname.length > 16) {
		let firstWord, secondWord, thirdWord;
		switch (nickname.split("").filter(symbol => symbol === "_").length) {
			case 1:
				[firstWord, secondWord] = nickname.split("_");
				nickname = firstWord.length < 16 ? firstWord : secondWord;
				break;
			case 2:
				[firstWord, secondWord, thirdWord] = nickname.split("_");
				nickname = firstWord.length < 16 ? firstWord : secondWord.length < 16 ? secondWord : thirdWord;
				break;
			default:
				nickname = null;
				break;
		}
	}

	if (nickname) nickname = isNicknameValidate(nickname) ? nickname : null;

	return nickname;
}

export async function convertedImageURLInBase64(url: string): Promise<string> {
	const { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + "ProfileImage.png");
	return await FileSystem.readAsStringAsync(uri, {
		encoding: "base64",
	});
}

export function printInformationError(name: string, error: Error, payload: string) {
	if (__DEV__) {
		console.error(
			`${new Date().toISOString()}: \nName \n\t${error.name} \nMessage:\n\t${error.message} \nCause: \n\t${
				error.cause ?? "Error not have cause"
			} \nPayload: \n\t${payload.replaceAll("\n", "\n\t")}	\nStack: \n${error.stack?.slice(
				error.stack.search(/\s+at/g)
			)}`
		);
	} else {
		Request.sendErrorInformation(name, error, payload);
	}
}
