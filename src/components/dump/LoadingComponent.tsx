import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const LoadingComponent = () => {
  const translateX = useSharedValue(0);
  const animationAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const [sizeElement, setSizeElement] = useState<{
    x: number;
    y: number;
  } | null>(null);
  return (
    <View
      style={styles.background}
      onLayout={({ nativeEvent: { layout } }) => {
        if (sizeElement === null) {
          setSizeElement({ x: layout.width, y: layout.height });
        }
      }}
    >
      <Animated.View
        style={{
          width: sizeElement?.x ?? 0 * 2,
          height: sizeElement?.y ?? 0 * 1.5,
        }}
      >
        <LinearGradient
          style={styles.background}
          colors={["#9765A8", "#9195D8", "#9765A8"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        ></LinearGradient>
      </Animated.View>
    </View>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationLiner: {},
  gradientLiner: {},
});
