/** @format */

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { RootScreenProps, SubscribeType } from "~types";
import { WebView } from "react-native-webview";
import { Converter, Request } from "~api";
import { SupportType } from "src/api/types";
import { Screen } from "~components/containers";

const Payment: RootScreenProps<"Payment"> = ({ navigation, route }) => {
	const { selectSubscribe } = route.params;
	const [dataForRequest, setDataForRequest] = React.useState<{ uri: string; header: { Authorization: string } } | null>(
		null
	);
	React.useEffect(() => {
		let ty: SupportType.SubscribeType | undefined = undefined;
		switch (selectSubscribe) {
			case SubscribeType.HALF_YEAR:
				ty = "Month6";
				break;
			case SubscribeType.MONTH:
				ty = "Month";
				break;
			case SubscribeType.WEEK:
				ty = "Week";
				break;
		}
		if (ty !== undefined) {
			Request.redirectPaymentURL(ty).then(r => {
				setDataForRequest(r);
			});
		}

		// Request.getSubscribeUserInformationSubs().then(r => {
		// 	const b = Converter.composeSubscribe(r);
		// 	console.log(b);
		// });
	}, []);
	return (
		<Screen backgroundColor={"#9765A8"} paddingHorizontalOff>
			{dataForRequest !== null ? (
				<WebView
					source={dataForRequest}
					useWebView2
					onLoad={({ nativeEvent: { url, mainDocumentURL } }) => {
						console.log(url, mainDocumentURL);
					}}
					style={{ width: "100%", height: "100%" }}
					onNavigationStateChange={({ url }) => {
						console.log(url);
						if (url.includes("https://evodigital.one/success")) {
							navigation.navigate("ResultSubscribeScreen", { status: "Designations" });
						} else if (url.includes("https://evodigital.one/fail")) {
							navigation.navigate("ResultSubscribeScreen", { status: "Fail" });
						} else if (url.includes("https://evodigital.one/")) {
							navigation.goBack();
						}
					}}
				/>
			) : (
				<ActivityIndicator color={"#FFF"} />
			)}
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default Payment;
