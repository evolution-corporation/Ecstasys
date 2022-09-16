import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import {
  TouchableOpacity,
  PressableProps,
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
  StyleProp,
  Pressable,
  ColorValue,
  ViewProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";

import Tools from "~core";

const Base: FC<Props> = (props) => {
  const {
    children,
    styleButton,
    secondItem,
    styleText,
    onPress = () => {},
    animationStyle,
    disabled,
    colors,
    onLayout,
  } = props;
  const _opacityButton = useSharedValue(1);

  const button = useAnimatedStyle(() => ({
    opacity: _opacityButton.value,
  }));

  const animationPress = async () => {
    withTiming(_opacityButton.value);
    _opacityButton.value = withSequence(
      withTiming(0.8, { duration: 500 }),
      withTiming(1)
    );
  };

  const _onPress = () => {
    animationPress();
    onPress();
  };

  let WrapperComponent: FC<ViewProps>;
  if (colors) {
    const strColors = colors as string[];
    WrapperComponent = ({ children }) => (
      <Animated.View style={[animationStyle, button]}>
        <LinearGradient
          colors={strColors}
          style={[styles.backgroundButton, styleButton]}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  } else {
    WrapperComponent = ({ children }) => (
      <Animated.View
        style={[styles.backgroundButton, styleButton, animationStyle, button]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Pressable
      onPress={() => _onPress()}
      disabled={disabled}
      onLayout={onLayout}
    >
      <WrapperComponent>
        {secondItem}
        <Text style={[styles.textButton, styleText]}>{children}</Text>
      </WrapperComponent>
    </Pressable>
  );
};

export interface Props extends PressableProps {
  styleButton?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  secondItem?: JSX.Element;
  onPress?: () => void;
  children?: string;
  animationStyle?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  colors?: ColorValue[];
}

const styles = StyleSheet.create({
  backgroundButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textButton: {
    color: "#555555",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default Base;
