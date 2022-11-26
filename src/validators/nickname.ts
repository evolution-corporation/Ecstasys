/** @format */

/**
 * Проверка на валидность уникального имени пользователя
 * @param nickname проверяемое уникальное имя пользователя
 * @return Если уникальное имя прошло валидацию, то вернет true, иначе false
 */
export default function (nickname: string): boolean {
	const validateSymbol = /^[a-z\d\._]*$/.test(nickname);
	const validateSize = nickname.length > 0 && nickname.length <= 16;
	return validateSize && validateSymbol;
}

export class NicknameNotValidate extends Error {
	constructor(message?: string) {
		super("The nickname being checked did not pass the validity check. " + message);
	}
}
