import { useFonts } from "expo-font";
import {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

export default () =>
	useFonts({
		Roboto_100Thin,
		Roboto_300Light,
		Roboto_400Regular,
		Roboto_500Medium,
		Roboto_700Bold,
		Roboto_900Black,
		Inter_700Bold,
	});
