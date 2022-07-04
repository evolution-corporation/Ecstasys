import React, { FC } from "react";
import { StyleSheet, ViewProps, ImageBackground, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CreateScreen from "./Screen";

const BackgroundGradient: FC<Props> = (props) => {
  if (props.isImage) {
    switch (props.imageName) {
      case "leaves":
        return (
          <LinearGradient
            colors={["rgba(151, 101, 168, 1)", "rgba(145, 149, 216, 1)"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          >
            <ImageBackground
              source={require("~assets/backgroundImage/leaves.png")}
              style={StyleSheet.absoluteFill}
            >
              {props.children}
            </ImageBackground>
          </LinearGradient>
        );
      case "sea":
      default:
        return (
          <ImageBackground
            source={require("~assets/backgroundImage/sea.png")}
            style={StyleSheet.absoluteFill}
          >
            <LinearGradient
              colors={[
                "rgba(92, 157, 255, 0)",
                "rgba(97, 115, 212, 1)",
                "rgba(106, 35, 130, 1)",
                "rgba(106, 35, 130, 1)",
              ]}
              style={StyleSheet.absoluteFill}
            >
              {props.children}
            </LinearGradient>
          </ImageBackground>
        );
    }
  } else {
    return (
      <LinearGradient
        colors={["rgba(151, 101, 168, 1)", "rgba(145, 149, 216, 1)"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        {props.children}
      </LinearGradient>
    );
  }
};

export default CreateScreen(BackgroundGradient);

type Props = General & (WithImage | NoImage);

interface General extends ViewProps {}

interface WithImage {
  isImage: true;
  imageName: "leaves" | "sea";
}

interface NoImage {
  isImage?: false;
}
