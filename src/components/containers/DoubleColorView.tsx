import React, { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const DoubleColorView: FC<DoubleColorViewProps> = (props) => {
  const { children, style, heightViewPart = 300 } = props;

  return (
    <>
      <View style={styles.background}>
        <View style={StyleSheet.absoluteFill}>
          <View
            style={[styles.part1, styles.colorPart, { height: heightViewPart }]}
          />
          <View style={[styles.part2, styles.colorPart]} />
        </View>
      </View>
      <View style={[StyleSheet.absoluteFill, style]}>{children}</View>
    </>
  );
};

export interface DoubleColorViewProps extends ViewProps {
  heightViewPart?: number;
}

const styles = StyleSheet.create({
  masked: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    ...StyleSheet.absoluteFillObject,
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
    height: 50,
    transform: [{ rotate: "6.08deg" }],
  },
});

export default DoubleColorView;
