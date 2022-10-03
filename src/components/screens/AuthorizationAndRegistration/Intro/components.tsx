import React, { FC } from "react";
import {
  PressableProps,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ColorValue,
} from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";

import Arrow from "./assets/Arrow.svg";
import ArrowForMask from "./assets/ArrowForMask.svg";

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
            <ArrowForMask />
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

export const ArrowButton: FC<PressableProps> = (props) => {
  const { style, onPress = () => {} } = props;
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
      <Arrow />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: "hidden",
  },
});
