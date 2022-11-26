/**
 * Файл содержит функции которые выполняют запрос а файловой системе
 * @format */

import * as FileSystem from "expo-file-system";

/**
 * Загружает изображения пользователя в файловую систему, кэш-директорию, и возвращают ссылку на изображение в файловой системе
 * @param url ссылка на изображение пользователя, которое необходимо загрузить в файловую систему
 * @returns ссылка на изображение в файловой системе
 */
export async function setImageByURL(url: string): Promise<string> {
	const { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + "UserProfile.png");
	return uri;
}

/**
 * Конвертирует изображение в Base64. Загружает изображение в кэш папку приложения под название "tempImage.png", читает его в Base64 и сохраняет в переменную, удаляет изображение и возвращает строку Base64
 * @param url ссылка на изображение которое необходимо конвертировать в Base64
 * @returns изображение в виде строки формата Base64
 */
export async function getBase64Image(url: string): Promise<string> {
	const { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + "tempImage.png");
	const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
	await FileSystem.deleteAsync(uri);
	return base64;
}

/**
 * Загружает аудиозапись медитационной практики в файловой хранилище в кэш папку приложения в под папку "practices" c название которое генерирует название из id практики с расширением mp3
 * @param id уникальный интенсификатор практики
 * @param url ссылка на аудио запись
 * @param callback функция которая будет возвращать ход загрузки, если это возможно
 * @returns ссылка на аудиозапись в файловой системе
 */
export async function downloadPractice(
	id: string,
	url: string,
	callback?: (loadingPercentage: number) => void
): Promise<string> {
	const downloadResumable = FileSystem.createDownloadResumable(
		url,
		FileSystem.cacheDirectory + "practices/" + `${id}.mp3`,
		{},
		({ totalBytesExpectedToWrite, totalBytesWritten }) => {
			if (callback && totalBytesExpectedToWrite !== -1) callback(totalBytesWritten / totalBytesExpectedToWrite);
		}
	);
	await downloadResumable.downloadAsync();
	return downloadResumable.fileUri;
}
