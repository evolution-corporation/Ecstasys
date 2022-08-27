import React, { FC } from "react";
import {
  PressableProps,
  StyleSheet,
  TouchableOpacity,
  View,
  ColorValue,
  ViewProps,
  ImageStyle,
} from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { G, Path, Defs } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";

export const ArrowButtonMask: FC<ArrowButtonProps> = (props) => {
  const { backgroundColor, color, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.background, { backgroundColor }]}
      onPress={!!onPress ? onPress : () => {}}
    >
      <MaskedView
        style={{ flex: 1, height: "100%" }}
        maskElement={
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name={`chevron-right`} size={24} color={color} />
          </View>
        }
      >
        <View style={[{ backgroundColor: color, flex: 1, height: "100%" }]} />
      </MaskedView>
    </TouchableOpacity>
  );
};

interface ArrowButtonProps extends PressableProps {
  backgroundColor: ColorValue;
  color: ColorValue;
}

export const ArrowButton: FC<PressableProps & { color?: ColorValue }> = (
  props
) => {
  const { style, onPress = () => {}, color = "black" } = props;
  if (typeof style === "function") throw new Error("Style not Function");
  return (
    <TouchableOpacity
      style={[
        styles.background,
        { alignItems: "center", justifyContent: "center" },
        style,
      ]}
      onPress={!!onPress ? onPress : () => {}}
    >
      <Entypo name={`chevron-left`} size={24} color={color} />
    </TouchableOpacity>
  );
};

export const Bird: FC<BirdProps> = (props) => {
  const { colorBird, styleBird } = props;
  return (
    <Svg width={158} height={173} fill="none" {...props}>
      {/*@ts-ignore */}
      <G filter="url(#a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M153.892 48.743a17.704 17.704 0 0 0-5.105-14.5 17.658 17.658 0 0 0-14.512-5.019 19.242 19.242 0 0 0-5.783 1.688 17.74 17.74 0 0 0-9.84 17.394c.353 3.854 1.91 7.5 4.452 10.416a17.766 17.766 0 0 0 19.326 4.791c.94-.351 1.851-.776 2.725-1.27a17.388 17.388 0 0 0 7.114-7.73c.431-.901.792-1.834 1.082-2.79.252-.972.433-1.96.541-2.959v-.02ZM90.09 101.988a85.836 85.836 0 0 1-38.477-40.705 85.997 85.997 0 0 1-5.209-55.806 1.918 1.918 0 0 1 1.641-1.464c.26-.03.522-.007.772.068 106.094 31.08 64.093 188.191-43.353 161.985a1.965 1.965 0 0 1-1.394-2.417 85.924 85.924 0 0 1 32.393-45.682 85.728 85.728 0 0 1 53.627-15.979Z"
          fill={colorBird}
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
};

interface BirdProps extends ViewProps {
  colorBird: ColorValue;
  styleBird?: ImageStyle;
}

const styles = StyleSheet.create({
  background: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: "hidden",
  },
  styleBird: {
    width: 150,
    height: 160,
  },
});
