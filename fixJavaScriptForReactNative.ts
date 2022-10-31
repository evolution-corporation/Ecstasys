/** @format */
Array.prototype.at = function (index: number) {
	if (this.length === 0 || this.length <= Math.abs(index)) {
		return undefined;
	}
	if (index >= 0) {
		return this[index];
	} else if (index < 0) {
		return this[this.length + index];
	}
};
