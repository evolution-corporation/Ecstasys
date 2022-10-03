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
    <Svg width={458} height={503} fill="none" {...props}>
      {/*@ts-ignore */}
      <G filter="url(#a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M453.676 138.23a53.138 53.138 0 0 0-2.69-23.503 53.069 53.069 0 0 0-12.625-19.996 52.967 52.967 0 0 0-20.049-12.514 52.917 52.917 0 0 0-23.488-2.544 57.731 57.731 0 0 0-17.349 5.062 53.148 53.148 0 0 0-22.806 21.527 53.244 53.244 0 0 0-6.713 30.656 55.221 55.221 0 0 0 13.355 31.247 53.342 53.342 0 0 0 26.792 16.071 53.3 53.3 0 0 0 31.186-1.697 57.173 57.173 0 0 0 8.175-3.813 52.153 52.153 0 0 0 21.344-23.185 59.466 59.466 0 0 0 3.245-8.374 61.69 61.69 0 0 0 1.623-8.874v-.063ZM262.269 297.965c-51.031-26.634-91.674-69.63-115.431-122.117A257.986 257.986 0 0 1 131.212 8.43a5.761 5.761 0 0 1 2.717-3.66 5.735 5.735 0 0 1 4.523-.527C456.733 97.484 330.731 568.815 8.392 490.197a5.864 5.864 0 0 1-4.345-4.941 5.88 5.88 0 0 1 .164-2.308c16.193-55.272 50.405-103.52 97.178-137.048a257.183 257.183 0 0 1 160.88-47.935Z"
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
