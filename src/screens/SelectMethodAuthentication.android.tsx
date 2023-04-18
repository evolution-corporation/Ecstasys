/** @format */

import React, { useCallback, useEffect, useState } from "react";
import {
	ImageBackground,
	StyleSheet,
	Text,
	View,
	Image,
	Platform,
	BackHandler,
	ActivityIndicator,
	Linking,
	Pressable,
} from "react-native";
import Swiper from "react-native-swiper";
import { useBackHandler, useDimensions } from "@react-native-community/hooks";

import Constants from "expo-constants";

import Tools from "~core";
import GoogleLogo from "~assets/icons/GoogleLogo.svg";
import { ColorButton, ColorWithIconButton } from "~components/dump";
import { RootScreenProps } from "~types";
import i18n from "~i18n";
import gStyle from "~styles";

import Bird from "assets/icons/BirdWhite.svg";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { actions, useAppDispatch } from "~store";
import { SafeAreaView } from "react-native-safe-area-context";
import AppleLogo from "~assets/icons/Apple.svg";

const SelectMethodAuthentication: RootScreenProps<"SelectMethodAuthentication"> = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [heightBottomBox, setHeightBottomBox] = useState<number | null>(null);
	const appDispatch = useAppDispatch();
	useBackHandler(() => {
		if (Platform.OS === "android") {
			BackHandler.exitApp();
		}
		return true;
	});
	const authWithGoogle = async () => {
		setIsLoading(true);

		try {
			const { idToken, serverAuthCode, user } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			await auth().signInWithCredential(googleCredential);
		} catch (error) {
			if (error instanceof Error && error.message === "Sign in action cancelled") {
				setIsLoading(false);
				return;
			}
		}
		await appDispatch(actions.sigIn()).unwrap();
	};

	const { window } = useDimensions();

	return (
		<ImageBackground style={{ flex: 1 }} source={require("~assets/mo-PtTbluAisCg-unsplash.png")}>
			{/* <StatusBar hidden /> */}
			<SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Bird />
				</View>
				<View style={{ flex: 1, justifyContent: "center" }} collapsable>
					<Text style={{ ...gStyle.styles.title, color: "#FFFFFF", marginHorizontal: 20 }}>
						{i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
						{"\n"}
						<Text style={Tools.gStyle.font("700")}>dmd meditation</Text>
					</Text>
					<Swiper
						width={window.width}
						containerStyle={{ maxHeight: 120 }}
						dotColor={"rgba(255, 255, 255, 0.5)"}
						activeDotColor={"rgba(255, 255, 255, 1)"}
						paginationStyle={{
							justifyContent: "flex-start",
							marginHorizontal: 20,
						}}
					>
						{[
							{ text: i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35") },
							{ text: i18n.t("7895ddaf-d2b6-4941-b6b3-576d31407534") },
							{ text: i18n.t("c26411fd-d759-4215-af1f-8bfc62f164d2") },
							{ text: i18n.t("5d03c5b2-39c8-4889-983f-9d2d268e6226") },
						].map((item, index) => (
							<View key={index} style={{ maxHeight: 120, paddingHorizontal: 20, paddingTop:10}}>
								<Text style={{ ...gStyle.styles.description, color: "#FFFFFF" }}>{item.text}</Text>
							</View>
						))}
					</Swiper>
				</View>
				<View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 20, paddingBottom: 20 }}>
					{isLoading ? (
						<ActivityIndicator color={"#FFFFFF"} size={"large"} />
					) : (
						<>
							<ColorButton
								styleButton={styles.button}
								onPress={() => {
									navigation.navigate("InputNumberPhone");
								}}
							>
								{i18n.t("526fba9f-2b69-4fe6-aefd-d491e86e59da")}
							</ColorButton>

							<ColorWithIconButton
								icon={<GoogleLogo style={{ marginLeft: 3.5 }} />}
								styleButton={styles.button}
								onPress={authWithGoogle}
							>
								{i18n.t("235a94d8-5deb-460a-bf03-e0e30e93df1b")}
							</ColorWithIconButton>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flexWrap: "wrap",
									marginTop: 10,
								}}
							>
								<Text style={styles.terms}>{i18n.t("4e5aa2a6-29db-44bc-8cf3-96e1ce338442")} </Text>
								<Pressable
									onPress={() => {
										Linking.openURL(
											"https://storage.yandexcloud.net/dmdmeditationimage/%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B4%D0%BB%D1%8F.pdf"
										);
									}}
									style={{ flex: 0, height: 16, width: "auto", justifyContent: "center", alignItems: "center" }}
								>
									<Text style={styles.document}>{i18n.t("userAgreement")}</Text>
								</Pressable>
								<Text style={styles.terms}> {i18n.t("and")} </Text>
								<Pressable
									onPress={() => {
										Linking.openURL(
											"https://storage.yandexcloud.net/dmdmeditationimage/%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%BE%D0%B5_%D1%81%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B4%D0%BB%D1%8F.pdf"
										);
									}}
									style={{ flex: 0, height: 16, width: "auto", justifyContent: "center", alignItems: "center" }}
								>
									<Text style={styles.document}>{i18n.t("privacyPolicy")}</Text>
								</Pressable>
								<Text style={styles.terms}> dmd meditation</Text>
							</View>
						</>
					)}
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	button: {
		marginVertical: 5,
		borderRadius: 100,
	},
	terms: {
		fontSize: 13,
		lineHeight: 16,
		...Tools.gStyle.font("400"),
		color: "#FFFFFF",
		textAlign: "center",
	},
	document: {
		...Tools.gStyle.font("700"),
		color: "#FFF",
		fontSize: 13,
		lineHeight: 16,
	},
});

export default SelectMethodAuthentication;
