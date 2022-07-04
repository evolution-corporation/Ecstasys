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
import Headphones from "./Headphones.svg";
import Sun from "./Sun.svg";
import Moon from "./Moon.svg";
import Rainbow from "./Rainbow.svg";
import Leaf from "./Leaf.svg";
import Puzzle from "./Puzzle.svg";
import CheckMarkerWhiteThin from "./CheckMarker_WhiteThin.svg";
import { useState } from "react";

const Icon: FC<Props> = (props) => {
  const { style, name } = props;
  // const [sizeTransform, setSizeTransform] = useState<number>(1);
  const Icons = useMemo<FC<SvgProps>>(() => {
    switch (name) {
      case "Headphones":
        return Headphones;
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

      case "Sun":
        return Sun;
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
  | IconWithManyVariable<"Play", "violet">;

type IconWithManyVariable<T, P> = { name: T; variable?: P };

type IconNameOneVariable =
  | "Google"
  | "LogoApp"
  | "PhotoIcon"
  | "Timer"
  | "Calendar"
  | "ChartColumns"
  | "Sun"
  | "Puzzle"
  | "Leaf"
  | "Rainbow"
  | "Moon"
  | "Headphones";

export default Icon;
