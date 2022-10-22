/** @format */

import i18n from "~i18n";

function getSubscribeInformation(endSubscribe: Date, isAutoPayment: boolean) {
	if (isAutoPayment) {
		return i18n.t("392fd6e3-9b0c-4673-b1c2-45deeaadd7b1", {
			dateTime: `${endSubscribe.getDate()}.${endSubscribe.getMonth() + 1}.${endSubscribe.getFullYear()}`,
		});
	} else {
		return i18n.t("048d71cd-03e2-4c8f-9f29-d2e5e9576a07", {
			dateTime: `${endSubscribe.getDate()}.${endSubscribe.getMonth() + 1}.${endSubscribe.getFullYear()}`,
		});
	}
}

export default getSubscribeInformation;
