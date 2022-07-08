import React, { FC, useEffect } from "react";
import {
  StyleSheet,
  ViewProps,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import gStyle, { colors } from "~styles";

const BackgroundGradient: FC<Props> = (props) => {
  const { height, width } = useWindowDimensions();

  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  useEffect(() => {
    console.log("mount");
    navigation.setOptions({
      headerTitleStyle: {
        fontSize: 20,
        color: colors.white,
        ...gStyle.getFontOption("bold"),
      },
      headerTintColor: colors.white,
      title: props.title ?? null,
    });
  }, [navigation]);
  if (props.isImage) {
    switch (props.imageName) {
      case "leaves":
        return (
          <LinearGradient
            colors={["rgba(151, 101, 168, 1)", "rgba(145, 149, 216, 1)"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          >
            <ImageBackground
              source={require("~assets/backgroundImage/leaves.png")}
              style={[
                styles.contentsBackground,
                props.style,
                { paddingTop: headerHeight },
              ]}
              resizeMethod={"resize"}
              resizeMode={"cover"}
              imageStyle={{ width, height }}
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
              style={[
                styles.contentsBackground,
                props.style,
                { paddingTop: headerHeight },
              ]}
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
        style={[
          styles.contentsBackground,
          props.style,
          { paddingTop: headerHeight },
        ]}
      >
        {props.children}
      </LinearGradient>
    );
  }
};

export default BackgroundGradient;

type Props = General & (WithImage | NoImage);

interface General extends ViewProps {
  title?: string;
}

interface WithImage {
  isImage: true;
  imageName: "leaves" | "sea";
}

interface NoImage {
  isImage?: false;
}

const styles = StyleSheet.create({
  contentsBackground: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
