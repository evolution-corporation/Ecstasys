import React, { forwardRef, useImperativeHandle } from "react";
import {
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BirdAnimation = forwardRef<Ref, Props>((props, ref) => {
  const { animationStyle, style } = props;
  const opacity = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value),
  }));

  return (
    <Animated.View style={[styles.background, animationStyle, style]}>
      <ImageBackground
        source={require("./assets/Bird.png")}
        style={styles.bird}
      >
        <Animated.View style={[styles.professor, aStyle]}>
          <Image source={require("./assets/Prof.png")} style={{ flex: 1 }} />
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
});

export interface Props extends ViewProps {
  animationStyle?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
}

export interface Ref {
  hideProffesor: () => void;
  showProffesor: () => void;
}

export default BirdAnimation;

const styles = StyleSheet.create({
  background: {
    transform: [{ scale: 0.1 }],
  },
  professor: {
    position: "absolute",
    flex: 1,
  },
  bird: {
    width: 500,
    height: 500,
  },
});
