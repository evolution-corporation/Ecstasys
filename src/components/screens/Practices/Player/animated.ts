import { useState } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function useAnimation(widthScreen: number) {
  const translateXSetButtonTime = useSharedValue(widthScreen / 2);
  const opacityPlayer = useSharedValue(1);
  const translateXTimer = useSharedValue(widthScreen);
  const [front, setFront] = useState<"player" | "timer">("player");
  const aStyle = {
    leftButtonControll: useAnimatedStyle(() => ({
      transform: [
        {
          translateX: withSpring(
            interpolate(translateXSetButtonTime.value, [0, 1], [0, -1])
          ),
        },
      ],
    })),
    rightButtonControll: useAnimatedStyle(() => ({
      transform: [
        {
          translateX: withSpring(translateXSetButtonTime.value),
        },
      ],
    })),
    player: useAnimatedStyle(() => ({
      opacity: withTiming(opacityPlayer.value),
      zIndex: front === "player" ? 2 : 1,
    })),
    timer: useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(translateXTimer.value) }],
      zIndex: front === "timer" ? 2 : 1,
    })),
  };

  const opernTimer = async () => {
    opacityPlayer.value = 0;
    translateXTimer.value = 0;
    setFront("timer");
  };

  const hiddenTimer = async () => {
    opacityPlayer.value = 1;
    translateXTimer.value = widthScreen;
    setFront("player");
  };

  const showSetButtonTime = async () => {
    translateXSetButtonTime.value = 0;
  };

  const hiddenSetButtonTime = async () => {
    translateXSetButtonTime.value = widthScreen / 2;
  };
  return {
    aStyle,
    opernTimer,
    hiddenTimer,
    showSetButtonTime,
    hiddenSetButtonTime,
  };
}
