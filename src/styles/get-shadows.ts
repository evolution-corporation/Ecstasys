import { Platform, ShadowStyleIOS } from "react-native";

export default (offset: number, blur: number): ShadowStyleIOS | { elevation: number } => {
	if (Platform.OS == "android") {
		return { elevation: offset };
	}
	return {
		shadowOffset: { width: 0, height: offset },
		shadowRadius: blur,
	};
};
