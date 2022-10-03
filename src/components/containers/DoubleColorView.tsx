import React, { FC, Children, useState, useEffect, useRef } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native";

export const heightViewPart2 = 42;

const DoubleColorView: FC<DoubleColorViewProps> = (props) => {
  const {
    children,
    style,
    heightViewPart = 0,
    hideElementVioletPart = false,
    onFunctionGetPaddingTop,
  } = props;
  const { width } = useWindowDimensions();
  return (
    <View style={styles.background}>
      <View
        style={[styles.header, { zIndex: hideElementVioletPart ? 10 : 0 }]}
        onLayout={(event) => {
          if (onFunctionGetPaddingTop) {
            onFunctionGetPaddingTop(
              (widthComponent) =>
                (widthComponent * heightViewPart2) / width + heightViewPart
            );
          }
        }}
      >
        <View style={[StyleSheet.absoluteFill]}>
          {heightViewPart > 0 && (
            <View
              style={[
                styles.part1,
                styles.colorPart,
                { height: heightViewPart },
              ]}
            />
          )}
          <View
            style={[
              styles.part2,
              styles.colorPart,
              {
                transform: [
                  {
                    rotate: `${
                      (Math.atan(heightViewPart2 / width) * 180) / Math.PI
                    }deg`,
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
      <View style={[style, { flex: 1 }]}>{children}</View>
    </View>
  );
};

export interface DoubleColorViewProps extends ViewProps {
  heightViewPart?: number;
  hideElementVioletPart?: boolean;
  getTopPaddingFirstElement?: number;
  onFunctionGetPaddingTop?: (getPaddingTop: (width: number) => number) => void;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    zIndex: 0,
  },
  contentContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    right: 0,
  },
  colorPart: {
    backgroundColor: "#9765A8",
  },
  part1: {
    width: "100%",
  },
  part2: {
    width: "200%",
    height: heightViewPart2,
  },
});

export default DoubleColorView;
