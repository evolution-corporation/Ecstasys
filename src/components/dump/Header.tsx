import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserButton from "./Buttons/User";
import i18n from "~i18n";
import gStyle from "~styles";
import { TabNavigatorList, RootStackList } from "~types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import ArrowBack from "assets/icons/ArrowBack.svg";
import TreeLine from "~assets/ThreeLine.svg";
import { useAppSelector } from "~store";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

export function getHeader(
	type: "titleAndUserButton" | "userButton" | "simple" | "userNicknameAndButtonOption",
	options?: { title?: string }
) {
	const headerStyle: StyleProp<ViewStyle> = {
		width: "100%",
		height: 60,
		flexDirection: "row",
		paddingHorizontal: 20,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "space-between",
		paddingVertical: 5,
	};
	let Header: React.FC<any>;
	switch (type) {
		case "titleAndUserButton":
			Header = () => {
				const navigation = useNavigation<BottomTabNavigationProp<TabNavigatorList, "Profile">>();
				if (options?.title === undefined) throw new Error("Not Found Title");
				return (
					<SafeAreaView style={headerStyle}>
						<Text style={{ ...gStyle.styles.Header, color: "#FFFFFF", width: "auto" }} adjustsFontSizeToFit>
							{options.title}
						</Text>
						<UserButton onPress={() => navigation.navigate("Profile")} />
					</SafeAreaView>
				);
			};
			break;
		case "userButton":
			Header = () => {
				const navigation = useNavigation<BottomTabNavigationProp<TabNavigatorList, "Profile">>();
				return (
					<SafeAreaView style={headerStyle}>
						<Animated.View exiting={FadeOutLeft} entering={FadeInLeft}>
							<UserButton onPress={() => navigation.navigate("Profile")} />
						</Animated.View>
					</SafeAreaView>
				);
			};
			break;
		case "simple":
			Header = () => {
				const navigation = useNavigation<StackNavigationProp<RootStackList, "Greeting">>();
				if (options?.title === undefined) throw new Error("Not Found Title");

				return (
					<SafeAreaView style={headerStyle}>
						<View style={{ width: "13%", height: "100%" }}>
							{navigation.canGoBack() ? (
								<Pressable
									style={{
										flex: 1,
										justifyContent: "center",
										alignItems: "flex-start",
										paddingLeft: 20,
									}}
									onPress={() => navigation.goBack()}
								>
									<ArrowBack />
								</Pressable>
							) : null}
						</View>
						<Text
							style={{
								...gStyle.styles.Header,
								color: "#FFFFFF",
								textAlignVertical: "center",
								textAlign: "center",
							}}
							adjustsFontSizeToFit
						>
							{options.title}
						</Text>
						<View>{}</View>
					</SafeAreaView>
				);
			};
			break;
		case "userNicknameAndButtonOption":
			Header = () => {
				const navigation = useNavigation<StackNavigationProp<RootStackList, "Greeting">>();
				const nickname = useAppSelector(store => {
					if (store.account.currentData === undefined) throw new Error("Максимально информативная ошибка");
					return store.account.currentData.nickName;
				});
				return (
					<SafeAreaView style={headerStyle}>
						<Text style={{ ...gStyle.styles.Header, color: "#FFFFFF" }}>{nickname}</Text>
						<Pressable
							style={{ width: "18%", height: "100%", justifyContent: "center", alignItems: "flex-end" }}
							onPress={() => {
								navigation.navigate("Options");
							}}
						>
							<TreeLine />
						</Pressable>
					</SafeAreaView>
				);
			};
			break;
	}
	return {
		header: () => <Header />,
		headerTransparent: true,
	};
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default getHeader;
