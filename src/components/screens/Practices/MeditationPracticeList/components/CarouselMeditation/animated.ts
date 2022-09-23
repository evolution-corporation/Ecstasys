import { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function (
  length: number,
  config?: {
    initIndex?: number;
    minScale?: number;
    translatyX?: number;
    imageHeigth?: number;
  }
) {
  const _config = {
    minScale: 0.7,
    translatyX: 25,
    imageHeigth: 277,
    initIndex: 0,
    ...config,
  };
  const listAnimatedValue: {
    scale: SharedValue<number>;
    translatyX: SharedValue<number>;
    zIndex: SharedValue<number>;
  }[] = [];
  const listAnimatedStyle: StyleProp<
    Animated.AnimateStyle<StyleProp<ViewStyle>>
  >[] = [];
  for (let i = 0; i < length; i++) {
    listAnimatedValue.push({
      scale: useSharedValue(i === _config.initIndex ? 1 : _config.minScale),
      translatyX: useSharedValue(
        i === _config.initIndex - 1
          ? _config.translatyX
          : i === _config.initIndex + 1
          ? -_config.translatyX
          : 0
      ),
      zIndex: useSharedValue(
        i === _config.initIndex - 1 || i === _config.initIndex + 1 ? 3 : 1
      ),
    });
    listAnimatedStyle.push(
      useAnimatedStyle(() => ({
        transform: [
          { scale: withTiming(listAnimatedValue[i].scale.value) },
          { translateX: withTiming(listAnimatedValue[i].translatyX.value) },
          {
            translateY: interpolate(
              listAnimatedValue[i].scale.value,
              [0.7, 1],
              [-(_config.imageHeigth * 0.3) / 2, 0]
            ),
          },
        ],
        zIndex: 1,
      }))
    );
  }

  const onStartAnimationScrollData = useCallback(() => {
    for (let i = 0; i < listAnimatedValue.length; i++) {
      listAnimatedValue[i].zIndex.value = 1;
    }
  }, []);

  const onEndAnimationScrollData = useCallback((selectedIndex: number) => {
    for (let i = 0; i < listAnimatedValue.length; i++) {
      listAnimatedValue[i].scale.value =
        selectedIndex === i ? 1 : _config.minScale;
      listAnimatedValue[i].translatyX.value =
        i === selectedIndex - 1
          ? _config.translatyX
          : i === selectedIndex + 1
          ? -_config.translatyX
          : 0;
      listAnimatedValue[i].zIndex.value =
        i === selectedIndex - 1 || i === selectedIndex + 1 ? 2 : 1;
    }
  }, []);

  const onMiddleAnimationScrollData = useCallback(() => {
    for (let i = 0; i < listAnimatedValue.length; i++) {
      listAnimatedValue[i].scale.value = _config.minScale;
      listAnimatedValue[i].translatyX.value = 0;
    }
  }, []);

  return {
    onStartAnimationScrollData,
    onEndAnimationScrollData,
    listAnimatedStyle,
    onMiddleAnimationScrollData,
  };
}
