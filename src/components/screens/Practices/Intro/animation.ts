import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function () {
  const birdScale = useSharedValue(1);
  const birdRotate = useSharedValue("0deg");
  const birdTranlateX = useSharedValue(-400);
  const birdTranlateY = useSharedValue(-340);

  const aStyle = {
    bird: useAnimatedStyle(() => ({
      transform: [
        { scale: withTiming(birdScale.value) },
        { rotate: withTiming(birdRotate.value) },
        { translateX: withTiming(birdTranlateX.value) },
        { translateY: withTiming(birdTranlateY.value) },
      ],
    })),
  };

  const firstPage = () => {
    birdScale.value = valueInit.birdScale;
    birdRotate.value = valueInit.birdRotate;
    birdTranlateX.value = valueInit.birdTranlateX;
    birdTranlateY.value = valueInit.birdTranlateY;
  };

  const twoPage = () => {
    birdRotate.value = valuePrev.birdScale;
    birdScale.value = valuePrev.birdRotate;
    birdTranlateX.value = valuePrev.birdTranlateX;
    birdTranlateY.value = valuePrev.birdTranlateY;
  };

  return { aStyle, firstPage, twoPage };
}

const valueInit = {
  birdScale: 1,
  birdRotate: "0deg",
  birdTranlateX: -350,
  birdTranlateY: -340,
};

const valuePrev = {
  birdScale: "50deg",
  birdRotate: 0.5,
  birdTranlateX: 300,
  birdTranlateY: 2100,
};
