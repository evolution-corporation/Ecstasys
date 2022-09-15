import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";

import { StyleSheet, View, ViewProps, ColorValue, Button } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Tools, { setColorOpacity } from "~core";

const TimeLine = forwardRef<Ref, TimeLineProps>((props, ref) => {
  const { color = "#FFFFFF", onChange, onStartChange, onEndChange } = props;

  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  const _colorBackground = setColorOpacity(color);
  const _colorBorderCircle = setColorOpacity(color, 0.5);
  const _frontLineWidth = useSharedValue(maxWidth ?? 0);
  const _scaleCircle = useSharedValue(1);
  const aStyles = {
    frontLine: useAnimatedStyle(() => ({
      width: _frontLineWidth.value,
    })),
    circle: useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(_scaleCircle.value) }],
    })),
  };
  //! В принципе должно работать, но не стоит этому доверять. ч1
  const stackMaxWidth = useRef<{ value: null | { (_maxWidth: number): void } }>(
    { value: null }
  );
  useEffect(() => {
    if (maxWidth !== null && stackMaxWidth.current.value) {
      stackMaxWidth.current.value(maxWidth);
      stackMaxWidth.current.value = null;
    }
  }, [maxWidth]);
  //!----------------------------------------------
  useImperativeHandle(ref, () => ({
    setValue: (percent) => {
      //! В принципе должно работать, но не стоит этому доверять. ч2
      if (maxWidth === null && stackMaxWidth.current.value === null) {
        stackMaxWidth.current.value = (_maxWidth) => {
          if (percent >= 0 && percent <= 1) {
            _frontLineWidth.value = withTiming(percent * _maxWidth);
          }
        };
      }
      //!----------------------------------------------
      if (maxWidth && percent >= 0 && percent <= 1) {
        _frontLineWidth.value = withTiming(percent * maxWidth);
      }
    },
  }));

  const lineGestureTap = Gesture.Pan()
    .onBegin((event) => {
      _frontLineWidth.value = withTiming(event.x);
      _scaleCircle.value = 1;
      if (onStartChange) runOnJS(onStartChange)();
    })
    .onUpdate((event) => {
      if (maxWidth && event.x >= 0 && event.x <= maxWidth) {
        _frontLineWidth.value = event.x;
      }
    })
    .onFinalize((event) => {
      if (maxWidth && onChange) {
        let percent = event.x / maxWidth;
        if (percent > 1) percent = 1;
        if (percent < 0) percent = 0;
        runOnJS(onChange)(percent);
      }
      _scaleCircle.value = 1;
      if (onEndChange) runOnJS(onEndChange)();
    });

  return (
    <GestureDetector gesture={lineGestureTap}>
      <View style={styles.background}>
        <View
          style={[
            styles.line,
            styles.backLine,
            { backgroundColor: _colorBackground },
          ]}
          onLayout={({ nativeEvent: { layout } }) => {
            if (maxWidth === null) {
              setMaxWidth(layout.width);
              _frontLineWidth.value = layout.width;
            }
          }}
        />

        <Animated.View
          style={[
            styles.line,
            styles.frontLine,
            aStyles.frontLine,
            { backgroundColor: color },
          ]}
        >
          <Animated.View
            style={[
              aStyles.circle,
              styles.circle,
              {
                backgroundColor: color,
                borderColor: _colorBorderCircle,
              },
            ]}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
});

interface TimeLineProps extends ViewProps {
  color?: ColorValue;
  onChange?: (percent: number) => void;
  onStartChange?: () => void;
  onEndChange?: () => void;
}

interface Ref {
  setValue: (percent: number) => void;
}

export default TimeLine;

const styles = StyleSheet.create({
  background: {
    height: 40,
    justifyContent: "center",
    width: "100%",
  },
  line: {
    height: 8,
    borderRadius: 3,
    position: "absolute",
  },
  backLine: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  frontLine: {
    zIndex: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    position: "absolute",
    right: -14,
  },
});
