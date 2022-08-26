import { useCallback, useMemo, useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function (
  preValue = {
    backgroundColor: "rgba(151, 101, 168, 0)",
    rotateBird: "83.17deg",
    scaleBird: 2.4,
    translateBird: { x: 40, y: -75 },
    colorTitle: "#3D3D3D",
    colorDescription: "rgba(64, 64, 64, 0.71)",
    backgroundColorButton: "#9765A8",
    colorColorButton: "#FFFFFF",
  },
  nextValue = {
    backgroundColor: "rgba(151, 101, 168, 1)",
    rotateBird: "0deg",
    scaleBird: 1,
    translateBird: { x: 0, y: 0 },
    colorTitle: "#FFFFFF",
    colorDescription: "#E7DDEC",
    backgroundColorButton: "#FFFFFF",
    colorColorButton: "#9765A8",
  }
) {
  const _backgroundColor = useSharedValue(preValue.backgroundColor);
  const _rotateBird = useSharedValue(preValue.rotateBird);
  const _scaleBird = useSharedValue(preValue.scaleBird);
  const _translateXBird = useSharedValue(preValue.translateBird.x);
  const _translateYBird = useSharedValue(preValue.translateBird.y);
  const _colorTitle = useSharedValue(preValue.colorTitle);
  const _colorDescription = useSharedValue(preValue.colorDescription);
  const _opacityProfessor = useSharedValue(1);

  const [_backgroundColorButton, set_backgroundColorButton] = useState(
    preValue.backgroundColorButton
  );
  const [_colorColorButton, set_colorColorButton] = useState(
    preValue.colorColorButton
  );

  const setNextValue = useCallback(() => {
    _backgroundColor.value = nextValue.backgroundColor;
    _rotateBird.value = nextValue.rotateBird;
    _scaleBird.value = nextValue.scaleBird;
    _translateXBird.value = nextValue.translateBird.x;
    _translateYBird.value = nextValue.translateBird.y;
    _colorTitle.value = nextValue.colorTitle;
    _colorDescription.value = nextValue.colorDescription;
    set_backgroundColorButton(nextValue.backgroundColorButton);
    set_colorColorButton(nextValue.colorColorButton);
    _opacityProfessor.value = 0;
  }, [nextValue]);

  const setPrevValue = useCallback(() => {
    _backgroundColor.value = preValue.backgroundColor;
    _rotateBird.value = preValue.rotateBird;
    _scaleBird.value = preValue.scaleBird;
    _translateXBird.value = preValue.translateBird.x;
    _translateYBird.value = preValue.translateBird.y;
    _colorTitle.value = preValue.colorTitle;
    _colorDescription.value = preValue.colorDescription;
    set_backgroundColorButton(preValue.backgroundColorButton);
    set_colorColorButton(preValue.colorColorButton);
    _opacityProfessor.value = 1;
  }, [preValue]);

  const background = useAnimatedStyle(() => ({
    backgroundColor: withTiming(_backgroundColor.value),
  }));

  const bird = useAnimatedStyle(() => ({
    transform: [
      { rotate: withTiming(_rotateBird.value) },
      { scale: withTiming(_scaleBird.value) },
      { translateX: withTiming(_translateXBird.value) },
      { translateY: withTiming(_translateYBird.value) },
    ],
  }));

  const title = useAnimatedStyle(() => ({
    color: withTiming(_colorTitle.value),
  }));

  const description = useAnimatedStyle(() => ({
    color: withTiming(_colorDescription.value),
  }));

  const button = {
    backgroundColor: _backgroundColorButton,
    color: _colorColorButton,
  };

  const professor = useAnimatedStyle(() => ({
    opacity: withTiming(_opacityProfessor.value),
  }));
  return {
    aStyles: { background, bird, title, description, button, professor },
    setNextValue,
    setPrevValue,
  };
}
