import "src/types";

export const toPascalCase = (text: string, separate = /[\s._-]+/) => {
	const words = text.split(separate);
	for (const wordIndex in words) {
		const word = words[wordIndex].toLowerCase();
		words[wordIndex] = word[0].toUpperCase() + (word.length > 1 ? word.slice(1) : "");
	}
	return words.join("");
};

String.prototype.toPascalCase = function (separate = /[\s._-]+/) {
	return toPascalCase(this.toString(), separate);
};
