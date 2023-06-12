/** @format */

import React, { useCallback, useEffect, useState } from "react";

import { Box, Flex, Text } from "@react-native-material/core";
import { AuthScreenProperties } from "~types";
import Logo from "~assets/svg/Logo.svg"
import AppName from "~assets/svg/AppName.svg"


import { useDimensions } from "@react-native-community/hooks";
import Animated, { FadeIn } from "react-native-reanimated";
import Button from "src/core/components/Button";
import { SharedElement } from "react-navigation-shared-element";


const IntroScreen: AuthScreenProperties<"IntroAboutApp"> = ({ navigation }) => {
	const { window } = useDimensions();

	const [showElementAnimated, setShowElementAnimated] = useState(0);

	const countElement = 5;

	const showNextElement = useCallback(() => {
		if (showElementAnimated <= countElement) {
			setShowElementAnimated(previous => ++previous)
			setTimeout(() => showNextElement(), 700)
		}
	}, [showElementAnimated, countElement])

	useEffect(() => {
		showNextElement()
	}, [])

	const openNextScreen = useCallback(() => {
		navigation.navigate("SelectMethodAuthentication")
	}, [])

	return (
		<Flex content="center" style={{ backgroundColor: "#F3F3F3", paddingHorizontal: 20, flex: 1 }}>
			<Flex center fill>
				{
					showElementAnimated >= 1 &&
					<Animated.View 
						entering={FadeIn}
					>
						<SharedElement id={"Logo"}>
							<Logo />
						</SharedElement>
					</Animated.View>
				}
			</Flex>
			<Flex fill>
				<Flex>
					{
						showElementAnimated >= 2 && 
							<Animated.View entering={FadeIn}>
								<Text color="#3D3D3D" variant="h4">
									Добро пожаловать в
								</Text>
							</Animated.View>
					}
					{
						showElementAnimated >= 3 &&
						<Animated.View entering={FadeIn}>
							<SharedElement id={"WelcomeAppName"}>
								<AppName />
							</SharedElement>
						</Animated.View>
					}
				</Flex>
				<Flex fill justify="between" pb={50}>
					<Box>
						{
							showElementAnimated >= 4 &&
							<Animated.View entering={FadeIn}>
								<Text color="#555555" variant="body1">
									Повышай свои способности концентрации, телесного и умственного 
									расслабления. Снимай ментальные ограничения и восстанавливай 
									образное мышление с помощью простых и эффективных техник.
								</Text>
							</Animated.View>
						}
						{
							window.height >= 500 && showElementAnimated >= 5 &&
							<Animated.View entering={FadeIn}>
								<Text color="#555555" variant="body1" style={{ marginTop: 12 }}>
									Целью нашего приложения является реализация твоего потенциала.
									Здесь собраны медитации и техники для работы с сознанием, которые 
									исследованы наукой и проверены временем!
								</Text>
							</Animated.View>
						}
					</Box>
					<Box mt={20}>
					{
						showElementAnimated >= 5 &&
						<Animated.View entering={FadeIn}>
							<Button title={"Приступим"} color="primary" onPress={openNextScreen}/>
						</Animated.View>
					}
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default IntroScreen;
