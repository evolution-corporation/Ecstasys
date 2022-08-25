import React, { FC } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyleProp } from "react-native-reanimated";

const AnimatedButton: FC<Props> = (props) => {
  const { style, onPress, children, animatedStyle } = props;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.background, style]}>
      <Animated.View style={[styles.animatedView, animatedStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: "hidden",
  },
  animatedView: {
    flex: 1,
  },
});

interface Props extends ViewProps {
  onPress?: () => void;
  animatedStyle?: AnimatedStyleProp<ViewStyle> | AnimatedStyleProp<ViewStyle>[];
}

export default AnimatedButton;
