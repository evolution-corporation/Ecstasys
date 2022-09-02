import { useCallback, useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function () {
  const _backgroundColor = useSharedValue(preValue.backgroundColor);
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
  const [_colorBird, set_colorBird] = useState(preValue.colorBird);

  const setNextValue = useCallback(() => {
    _backgroundColor.value = nextValue.backgroundColor;
    _scaleBird.value = nextValue.scaleBird;
    _translateXBird.value = nextValue.translateBird.x;
    _translateYBird.value = nextValue.translateBird.y;
    _colorTitle.value = nextValue.colorTitle;
    _colorDescription.value = nextValue.colorDescription;
    set_backgroundColorButton(nextValue.backgroundColorButton);
    set_colorColorButton(nextValue.colorColorButton);
    _opacityProfessor.value = 0;
    set_colorBird(nextValue.colorBird);
  }, [nextValue]);

  const setPrevValue = useCallback(() => {
    _backgroundColor.value = preValue.backgroundColor;
    _scaleBird.value = preValue.scaleBird;
    _translateXBird.value = preValue.translateBird.x;
    _translateYBird.value = preValue.translateBird.y;
    _colorTitle.value = preValue.colorTitle;
    _colorDescription.value = preValue.colorDescription;
    set_backgroundColorButton(preValue.backgroundColorButton);
    set_colorColorButton(preValue.colorColorButton);
    set_colorBird(preValue.colorBird);

    _opacityProfessor.value = 1;
  }, [preValue]);

  const background = useAnimatedStyle(() => ({
    backgroundColor: withTiming(_backgroundColor.value, { duration: 1000 }),
  }));

  const bird = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(_scaleBird.value) },
      { translateX: withTiming(_translateXBird.value, { duration: 1000 }) },
      { translateY: withTiming(_translateYBird.value, { duration: 1000 }) },
    ],
  }));

  const title = useAnimatedStyle(() => ({
    color: withTiming(_colorTitle.value),
  }));

  const description = useAnimatedStyle(() => ({
    color: withTiming(_colorDescription.value, { duration: 1000 }),
  }));

  const button = {
    backgroundColor: _backgroundColorButton,
    color: _colorColorButton,
  };

  const professor = useAnimatedStyle(() => ({
    opacity: withTiming(_opacityProfessor.value, { duration: 200 }),
  }));

  return {
    aStyles: {
      background,
      bird,
      title,
      description,
      button,
      professor,
      _colorBird,
    },
    setNextValue,
    setPrevValue,
  };
}

const preValue = {
  backgroundColor: "rgba(151, 101, 168, 1)",
  scaleBird: 3.2,
  translateBird: { x: 0, y: -10 },
  colorTitle: "#FFFFFF",
  colorDescription: "#E7DDEC",
  backgroundColorButton: "#FFFFFF",
  colorColorButton: "#9765A8",
  colorBird: "#E7DDEC",
};
const nextValue = {
  backgroundColor: "rgba(151, 101, 168, 0)",
  scaleBird: 1,
  translateBird: { x: 0, y: 35 },
  colorTitle: "#3D3D3D",
  colorDescription: "rgba(64, 64, 64, 0.71)",
  backgroundColorButton: "#9765A8",
  colorColorButton: "#FFFFFF",
  colorBird: "#9765A8",
};
