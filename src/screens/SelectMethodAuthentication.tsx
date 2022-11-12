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
	Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useBackHandler } from "@react-native-community/hooks";

import Constants from "expo-constants";

import Tools from "~core";
import GoogleLogo from "~assets/icons/GoogleLogo.svg";
import { ColorButton, ColorWithIconButton } from "~components/dump";
import { RootScreenProps } from "~types";
import i18n from "~i18n";

import Bird from "assets/icons/BirdWhite.svg";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { actions, useAppDispatch } from "~store";
import { StatusBar } from "expo-status-bar";

var height = Dimensions.get("window").height;

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
		GoogleSignin.configure({
			webClientId: "878799007977-cj3549ni87jre2rmg4eq0hiolp08igh2.apps.googleusercontent.com",
		});
		try {
			const { idToken, serverAuthCode, user } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			await auth().signInWithCredential(googleCredential);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Sign in action cancelled") {
					setIsLoading(false);
					return;
				}
			}
		}
		await appDispatch(actions.signInAccount()).unwrap();
		await GoogleSignin.signOut();
	};

	return (
		<ImageBackground style={styles.background} source={require("~assets/rockDrugs.jpg")}>
			<StatusBar hidden />
			<View style={styles.logoBox}>
				<Bird />
				{/* <Image style={[styles.bird]} source={require("./assets/bird.png")} resizeMode={"contain"} /> */}
			</View>
			<View style={styles.greetingBox}>
				<Text style={styles.title}>
					{i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
					{"\n"}
					<Text style={Tools.gStyle.font("700")}>dmd meditation</Text>
				</Text>
				<View style={styles.swiper}>
					<Swiper
						dotColor={"rgba(255, 255, 255, 0.5)"}
						activeDotColor={"rgba(255, 255, 255, 1)"}
						paginationStyle={{
							justifyContent: "flex-start",
						}}
					>
						<View style={{}}>
							<Text style={styles.swiperText}>{i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35")}</Text>
						</View>
						<View style={{}}>
							<Text style={styles.swiperText}>{i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35")}</Text>
						</View>
					</Swiper>
				</View>
			</View>
			{isLoading ? (
				<View
					style={{
						height: heightBottomBox ?? "auto",
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator color={"#FFFFFF"} size={"large"} />
				</View>
			) : (
				<View
					style={styles.selectMethodBox}
					onLayout={({ nativeEvent: { layout } }) => {
						if (heightBottomBox === null) setHeightBottomBox(layout.height);
					}}
				>
					<ColorButton
						styleButton={styles.button}
						onPress={() => {
							navigation.navigate("InputNumberPhone");
						}}
					>
						{i18n.t("526fba9f-2b69-4fe6-aefd-d491e86e59da")}
					</ColorButton>
					<ColorWithIconButton icon={<GoogleLogo />} styleButton={styles.button} onPress={authWithGoogle}>
						{i18n.t("235a94d8-5deb-460a-bf03-e0e30e93df1b")}
					</ColorWithIconButton>
					<Text style={styles.terms}>
						{i18n.t("4e5aa2a6-29db-44bc-8cf3-96e1ce338442")}{" "}
						<Text style={styles.document}>{i18n.t("userAgreement")}</Text> {i18n.t("and")}{" "}
						<Text style={styles.document}>{i18n.t("userAgreement")}</Text> ecstasys
					</Text>
				</View>
			)}
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
	bird: {
		height: height * 0.19,
	},
	logoBox: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	greetingBox: {
		height: 200,
	},
	selectMethodBox: {
		justifyContent: "flex-end",
	},
	title: {
		fontSize: 32,
		color: "#FFFFFF",
		lineHeight: 42,
		fontFamily: "Gilroy",
		fontWeight: "700",
	},
	swiper: {
		flex: 1,
	},
	swiperText: {
		color: "#FFFFFF",
		fontSize: 16,
		lineHeight: 24,
		...Tools.gStyle.font("400"),
	},
	button: {
		marginVertical: 5,
	},
	terms: {
		fontSize: 13,
		lineHeight: 15,
		...Tools.gStyle.font("400"),
		color: "#FFFFFF",
		textAlign: "center",
	},
	document: {
		...Tools.gStyle.font("700"),
	},
	devOptions: {
		position: "absolute",
		alignSelf: "flex-end",
	},
});

export default SelectMethodAuthentication;
