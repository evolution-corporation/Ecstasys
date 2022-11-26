/** @format */

import { converterDisplayNameToNickname } from "src/tools";

test("converterDisplayNameToNickname size 0 - 16, validate symbol", () => {
	expect(converterDisplayNameToNickname("aardvark")).toBe("aardvark");
});
