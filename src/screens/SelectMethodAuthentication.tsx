/** @format */

import React, { useCallback, useState } from "react";
import {
	BackHandler,
	ImageBackground,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import Swiper from "react-native-swiper";
import { useBackHandler, useDimensions } from "@react-native-community/hooks";


import Tools from "~core";
import { AuthScreenProperties, RootScreenProps } from "~types";
import i18n from "~i18n";

import { Box, Flex, Stack, Text } from "@react-native-material/core";
import Animated, { FadeInDown } from "react-native-reanimated";

import { MaterialIcons, Ionicons } from '@expo/vector-icons'; 


import Logo from "~assets/svg/Logo.svg"
import AppName from "~assets/svg/AppName.svg"

import { SharedElement } from "react-navigation-shared-element";
import Button from "src/core/components/Button";
import useGoogleAuth from "src/core/hooks/UseGoogleAuth";
import useAppleAuth from "src/core/hooks/UseAppleAuth";


const SelectMethodAuthentication: AuthScreenProperties<"SelectMethodAuthentication"> = ({ navigation }) => {
	
	useBackHandler(() => {
		if (Platform.OS === "android") {
			BackHandler.exitApp();
		}
		return true;
	});
	

	const { window } = useDimensions();

	const googleAuth = useGoogleAuth()

	const appleAuth = useAppleAuth()

	const phoneAuth = useCallback(() => {
		navigation.navigate("PhoneAuth")
	}, [navigation])

	return (
		<Flex content="center" style={{ backgroundColor: "#F3F3F3" }} fill>
			<Flex 
				fill={1} 
				content={"center"} 
				justify="center" 
				items={"center"} 
			>
					<SharedElement id={"Logo"} style={{ transform: [{ scale: 0.5 }] }}>
						<Logo />
					</SharedElement>
					<Flex items="start" w={"100%"} ph={20}>
						<SharedElement id={"WelcomeAppName"}>
							<AppName />
						</SharedElement>
					</Flex>
			</Flex>
			<Flex fill={2}>
				<Animated.View entering={FadeInDown} style={{ flex: 1 }}>
					<Box style={{ flex: 1, borderTopLeftRadius: 32, overflow: "hidden" }}>
						<ImageBackground
							source={require("~assets/mo-PtTbluAisCg-unsplash.png")}
							style={{ flex: 1 }}
						>
							<Box w={window.width} h={200}>
								<Swiper
									style={{ marginTop: 24 }}
									width={window.width}
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
											<Text color="#FFF" variant={"h6"}>{item.text}</Text>
										</View>
									))}
								</Swiper>
							</Box>
							<Flex fill items="center" justify="end" mb={32}>
								<Text variant="h6" color={"#FFF"}>Войти через</Text>
								<Stack
									spacing={24}
									mt={18}
								>
								<Button 
									title={"Войти по номеру телефона"}
									color="primary"
									leading={
										<MaterialIcons 
											name="phone" 
											size={24}
											color="secondary"
										/>
									}
									tintColor="secondary"
									onPress={phoneAuth}
								/>
								{
									googleAuth.isSupport && 
									<Button 
										title={"Войти с Google"}
										color="primary"
										leading={
											<Ionicons 
												name="logo-google" 
												size={24} 
												color="secondary" 
											/>
										}
										tintColor="secondary"
										loading={googleAuth.isLoading}
										onPress={googleAuth.authentication}
									/>
								}
								{
									appleAuth.isSupport && 
									<Button 
										title={"Войти с Apple"}
										color="primary"
										leading={
											<Ionicons 
												name="logo-google" 
												size={24} 
												color="secondary" 
											/>
										}
										tintColor="secondary"
										loading={appleAuth.isLoading}
										onPress={appleAuth.authentication}
									/>
								}
								</Stack>
							</Flex>
						</ImageBackground>
					</Box>
				</Animated.View>
			</Flex>
		</Flex>
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
