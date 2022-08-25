import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LogoApp from "~components/image/LogoApp";

import { colors } from "~styles";

const IntroContainer = forwardRef((props, ref) => {
  const { children } = props;
  const [colorLogo, setColorLogo] = useState(colors.moreViolet);
  const backgroundColorScreen = useSharedValue(colors.white);
  const logoSize = useSharedValue(1);
  const logoRotate = useSharedValue("83.17deg");
  const logoTranslateY = useSharedValue(-100);
  const logoTranslateX = useSharedValue(-45);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(backgroundColorScreen.value),
  }));
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(logoSize.value) },
      { rotate: withTiming(logoRotate.value) },
      { translateY: withTiming(logoTranslateY.value) },
      { translateX: withTiming(logoTranslateX.value) },
    ],
  }));

  useImperativeHandle(ref, () => ({
    next: () => {
      logoSize.value = 0.5;
      logoRotate.value = "0deg";
      backgroundColorScreen.value = colors.moreViolet;
      logoTranslateY.value = -300;
      logoTranslateX.value = 0;
      setColorLogo(colors.StrokePanel);
    },
    prev: () => {
      logoSize.value = 1;
      logoRotate.value = "83.17deg";
      backgroundColorScreen.value = colors.white;
      logoTranslateY.value = -100;
      logoTranslateX.value = -45;
      setColorLogo(colors.moreViolet);
    },
  }));

  return (
    <Animated.View style={[styles.background, backgroundAnimatedStyle]}>
      <Animated.View style={[styles.logo, logoAnimatedStyle]}>
        <LogoApp colorLogo={colorLogo} scale={6.28} />
      </Animated.View>
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  logo: {
    position: "absolute",
    top: "5%",
    zIndex: 0,
    alignSelf: "center",
  },
});

export default IntroContainer;
