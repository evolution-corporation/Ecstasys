import React, { FC, useMemo } from "react";
import { ColorValue, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import GoogleLogo from "./GoogleLogo.svg";
import LogoApp from "./LogoApp.svg";
import PhotoIcon from "./PhotoIcon.svg";
import TheArrowWhiteTop from "./TheArrow_WhiteTop.svg";
import TheArrowWhiteLeft from "./TheArrow_WhiteLeft.svg";
import CrossMarkerWhite from "./CrossMarker_White.svg";
import CheckMarkerWhite from "./CheckMarker_White.svg";
import CheckMarkerGreen from "./CheckMarker_Green.svg";
import ChartColumns from "./ChartColumns.svg";
import Calendar from "./Calendar.svg";
import Timer from "./Timer.svg";
import PlayViolet from "./Play_Violet.svg";
import Headphones_violet from "./Headphones_violet.svg";
import Headphones_white from "./Headphones_white.svg";
import Sun_yellow from "./Sun_yellow.svg";
import Sun_violet from "./Sun_Violet.svg";
import Sun_gray from "./Sun_Gray.svg";

import Moon from "./Moon.svg";
import Rainbow from "./Rainbow.svg";
import Leaf from "./Leaf.svg";
import Puzzle from "./Puzzle.svg";
import CheckMarkerWhiteThin from "./CheckMarker_WhiteThin.svg";
import Lock from "./Lock.svg";

import ControlButton_Left from "./ControlButton_Left.svg";
import ControlButton_Pause from "./ControlButton_Pause.svg";
import ControlButton_Play from "./ControlButton_Play.svg";
import ControlButton_Right from "./ControlButton_Right.svg";

import Heart_Red from "./Heart_Red.svg";
import Heart_Transparent from "./Heart_Transparent.svg";

import Home_Violet from "./Home_Violet.svg";
import Home_White from "./Home_White.svg";

const Icon: FC<Props> = (props) => {
  const { style, name } = props;
  // const [sizeTransform, setSizeTransform] = useState<number>(1);
  const Icons = useMemo<FC<SvgProps>>(() => {
    switch (name) {
      case "Headphones":
        switch (props.variable) {
          case "white":
            return Headphones_white;
          case "violet":
          default:
            return Headphones_violet;
        }

      case "Google":
        return GoogleLogo;
      case "LogoApp":
        return LogoApp;
      case "PhotoIcon":
        return PhotoIcon;
      case "TheArrow":
        switch (props.variable) {
          case "whiteTop":
            return TheArrowWhiteTop;
          case "whiteLeft":
          default:
            return TheArrowWhiteLeft;
        }
      case "Calendar":
        return Calendar;
      case "ChartColumns":
        return ChartColumns;
      case "Timer":
        return Timer;
      case "Lock":
        return Lock;
      case "Sun":
        switch (props.variable) {
          case "violet":
            return Sun_violet;
          case "gray":
            return Sun_gray;
          case "yellow":
          default:
            return Sun_yellow;
        }
      case "Home":
        switch (props.variable) {
          case "violet":
            return Home_Violet;
          case "white":
          default:
            return Home_White;
        }
      case "Rainbow":
        return Rainbow;
      case "Moon":
        return Moon;
      case "Leaf":
        return Leaf;
      case "Puzzle":
        return Puzzle;

      case "Play":
        switch (props.variable) {
          case "violet":
          default:
            return PlayViolet;
        }
      case "CheckMarker":
        switch (props.variable) {
          case "green":
            return CheckMarkerGreen;
          case "whiteThin":
            return CheckMarkerWhiteThin;
          case "white":
          default:
            return CheckMarkerWhite;
        }
      case "CrossMarker":
        switch (props.variable) {
          case "white":
          default:
            return CrossMarkerWhite;
        }
      case "ControlButton":
        switch (props.variable) {
          case "Left":
            return ControlButton_Left;
          case "Play":
            return ControlButton_Play;
          case "Right":
            return ControlButton_Right;
          case "Pause":
          default:
            return ControlButton_Pause;
        }
      case "Heart":
        switch (props.variable) {
          case "red":
            return Heart_Red;
          case "transparent":
          default:
            return Heart_Transparent;
        }
    }
  }, [name]);

  const size = useMemo<{
    width?: number | string;
    height?: number | string;
  }>(() => {
    if (props.style == undefined) {
      return {};
    }
    if (Array.isArray(props.style)) {
      return {
        width: props.style[props.style.length - 1].width,
        height: props.style[props.style.length - 1].height,
      };
    }
    return {
      width: props.style.width,
      height: props.style.height,
    };
  }, [props.style]);
  if (size.height && size.width) {
    return <Icons style={style} {...size} />;
  }
  return <Icons style={style} />;
};

type Props = General & ({ name: IconNameOneVariable } | ManyVariable);

export type IconName = IconNameOneVariable;

interface General {
  style?: ViewStyle | ViewStyle[];
}

type ManyVariable =
  | IconWithManyVariable<"CheckMarker", "green" | "white" | "whiteThin">
  | IconWithManyVariable<"CrossMarker", "white">
  | IconWithManyVariable<"TheArrow", "whiteTop" | "whiteLeft">
  | IconWithManyVariable<"Play", "violet">
  | IconWithManyVariable<"ControlButton", "Left" | "Pause" | "Play" | "Right">
  | IconWithManyVariable<"Heart", "red" | "transparent">
  | IconWithManyVariable<"Sun", "gray" | "violet" | "yellow">
  | IconWithManyVariable<"Home", "white" | "violet">
  | IconWithManyVariable<"Headphones", "violet" | "white">;

type IconWithManyVariable<T, P> = { name: T; variable?: P };

type IconNameOneVariable =
  | "Google"
  | "LogoApp"
  | "PhotoIcon"
  | "Timer"
  | "Calendar"
  | "ChartColumns"
  | "Puzzle"
  | "Leaf"
  | "Rainbow"
  | "Moon"
  | "Lock";

export default Icon;
