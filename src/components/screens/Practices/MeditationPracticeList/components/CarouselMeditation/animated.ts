import { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function (
  length: number,
  config: { initIndex?: number; minScale: number; translatyX: number } = {
    minScale: 0.7,
    translatyX: 20,
  }
) {
  if (config.initIndex === undefined) {
    config.initIndex = 0;
  }
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
      scale: useSharedValue(i === config.initIndex ? 1 : config.minScale),
      translatyX: useSharedValue(
        i === config.initIndex - 1
          ? config.translatyX
          : i === config.initIndex + 1
          ? -config.translatyX
          : 0
      ),
      zIndex: useSharedValue(
        i === config.initIndex - 1 || i === config.initIndex + 1 ? 3 : 1
      ),
    });
    listAnimatedStyle.push(
      useAnimatedStyle(() => ({
        transform: [
          { scale: withTiming(listAnimatedValue[i].scale.value) },
          { translateX: withTiming(listAnimatedValue[i].translatyX.value) },
        ],
        zIndex: 1,
      }))
    );
  }

  const onStartAnimationScrollData = useCallback(() => {
    for (let i = 0; i < listAnimatedValue.length; i++) {
      listAnimatedValue[i].scale.value = config.minScale;
      listAnimatedValue[i].translatyX.value = 0;
      listAnimatedValue[i].zIndex.value = 1;
    }
  }, []);

  const onEndAnimationScrollData = useCallback((selectedIndex: number) => {
    for (let i = 0; i < listAnimatedValue.length; i++) {
      listAnimatedValue[i].scale.value =
        selectedIndex === i ? 1 : config.minScale;
      listAnimatedValue[i].translatyX.value =
        i === selectedIndex - 1
          ? config.translatyX
          : i === selectedIndex + 1
          ? -config.translatyX
          : 0;
      listAnimatedValue[i].zIndex.value =
        i === selectedIndex - 1 || i === selectedIndex + 1 ? 2 : 1;
    }
  }, []);

  return {
    onStartAnimationScrollData,
    onEndAnimationScrollData,
    listAnimatedStyle,
  };
}
