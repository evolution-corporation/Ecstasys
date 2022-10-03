import { Platform, ShadowStyleIOS, StyleSheet } from "react-native";
import { useCustomFonts, getFontOption } from "./font";
import colors, { setColorOpacity } from "./colors";
import { ToastOptions } from "react-native-root-toast";

function getShadows(
  offset: number,
  blur: number
): ShadowStyleIOS | { elevation: number } {
  if (Platform.OS == "android") {
    return { elevation: offset };
  } else {
    return {
      shadowOffset: { width: 0, height: offset },
      shadowRadius: blur,
    };
  }
}

export const styleImage = StyleSheet.create({
  imageFullWidth: {
    width: "100%",
    resizeMode: "contain",
  },
});

export const styleText = StyleSheet.create({
  h1: {
    fontSize: 20,
    lineHeight: 23.44,
    textAlign: "center",
    ...getFontOption("700"),
  },
  subTitle: {
    fontSize: 12,
    color: colors.TextOnTheBackground,
    ...getFontOption("500"),
    textAlign: "center",
  },
  helpMessage: {
    fontSize: 13,
    color: colors.TextOnTheBackground,
    ...getFontOption("400"),
    textAlign: "center",
  },
});

const toastOptions: ToastOptions = {
  textColor: colors.gray,
  backgroundColor: colors.white,
  shadowColor: colors.DarkGlass,
  containerStyle: {
    borderRadius: 15,
  },
};

export { useCustomFonts, toastOptions, setColorOpacity };

export default {
  font: getFontOption,
  colors,
  shadows: getShadows,
  globalStyle: { ...styleText, ...styleImage },
};
