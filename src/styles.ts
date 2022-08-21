import { StyleSheet, ViewStyle, Platform, ShadowStyleIOS } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadAsync as loadAsyncFont, FontSource } from "expo-font";
import {
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";

import { LoadingStatus } from "~constants";
import { ToastOptions } from "react-native-root-toast";

export type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type callback = (data: { loadingStatus: LoadingStatus }) => void;

export class StyleClass {
  private callback?: callback;
  private statusLoading: LoadingStatus = LoadingStatus.NONE;

  constructor() {
    this.statusLoading = LoadingStatus.LOADING;
    this.loadingFonts().then(() => {
      this.statusLoading = LoadingStatus.READY;
      if (this.callback) {
        this.callback({ loadingStatus: this.statusLoading });
      }
    });
  }

  private async loadingFonts() {
    await loadAsyncFont("Roboto_100-200", Roboto_100Thin);
    await loadAsyncFont("Roboto_300", Roboto_300Light);
    await loadAsyncFont("Roboto_400", Roboto_400Regular);
    await loadAsyncFont("Roboto_500", Roboto_500Medium);
    await loadAsyncFont("Roboto_600-700", Roboto_700Bold);
    await loadAsyncFont("Roboto_800-900", Roboto_900Black);
  }

  public getFontOption(weight: FontWeight = "normal"): {
    fontFamily: string;
    fontWeight?: FontWeight;
  } {
    if (Platform.OS == "android") {
      switch (weight) {
        case "100":
        case "200":
          return { fontFamily: "Roboto_100-200" };
        case "300":
          return { fontFamily: "Roboto_300" };
        case "400":
          return { fontFamily: "Roboto_400" };
        case "500":
        case "normal":
          return { fontFamily: "Roboto_500" };
        case "600":
        case "700":
        case "bold":
          return { fontFamily: "Roboto_600-700" };
        case "800":
        case "900":
          return { fontFamily: "Roboto_800-900" };
      }
    }
    return { fontFamily: "System", fontWeight: weight };
  }

  public getShadows(
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

  public on(callback: callback): void {
    this.callback = callback;
    this.callback({ loadingStatus: this.statusLoading });
  }

  public get fullWidth(): ViewStyle {
    return { width: "100%", alignItems: "center" };
  }
}

const style = new StyleClass();

export default style;

export const styleImage = StyleSheet.create({
  imageFullWidth: {
    width: "100%",
    resizeMode: "contain",
  },
});

export const colors = {
  StrokePanel: "#C2A9CE",
  TextOnTheBackground: "#E7DDEC",
  white: "#FFFFFF",
  DarkLetters: "#555555",
  black: "#000000",
  WhiteGlass: "rgba(255, 255, 255, 0.2)",
  WhiteBrightGlass: "rgba(255, 255, 255, 0.8)",
  gray: "#3D3D3D",
  DarkGlass: "rgba(0, 0,0 ,0.2)",
  orange: "#FF5C00",
  grayGlass: "rgba(240, 242, 238, 0.19)",
  violet: "#702D87",
  grayHell: "#A0A0A0",
  skin: "#FEEBED",
  perano: "#A7A9E0",
  carbon: "#3D3D3D",
  moreViolet: "#9765A8",
  moreGray: "rgba(64, 64, 64, 0.71)",
};

export const styleText = StyleSheet.create({
  h1: {
    fontSize: 20,
    lineHeight: 23.44,
    textAlign: "center",
    ...style.getFontOption("700"),
  },
  subTitle: {
    fontSize: 12,
    color: colors.TextOnTheBackground,
    ...style.getFontOption("500"),
    textAlign: "center",
  },
  helpMessage: {
    fontSize: 13,
    color: colors.TextOnTheBackground,
    ...style.getFontOption("400"),
    textAlign: "center",
  },
});

export const toastOptions: ToastOptions = {
  textColor: colors.gray,
  backgroundColor: colors.white,
  shadowColor: colors.DarkGlass,
  containerStyle: {
    borderRadius: 15,
  },
};
