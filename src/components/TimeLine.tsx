import React, {
  useMemo,
  useState,
  useRef,
  FC,
  useEffect,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  LayoutRectangle,
  ViewProps,
  Pressable,
} from "react-native";
import AudioControlContext from "~contexts/audioControl";
import style, { colors } from "~styles";

//! Перевести в HOC
const TimeLine: FC<TimeLineProps> = (props) => {
  // const [isAnimation, setIsAnimation] = useState<boolean>(false);
  const [positionMillisCurrent, setPositionMillisCurrent] = useState<number>(0);
  const [isEditPositionMillisCurrent, setIsEditPositionMillisCurrent] =
    useState<boolean>(false);
  const { durationMillis, positionMillis, style } = props;
  const audioControlContext = useContext(AudioControlContext);
  const [layoutTimeLine, setLayoutTimeLine] = useState<LayoutRectangle | null>(
    null
  );
  const currentPosition = useRef(new Animated.Value(0)).current;
  currentPosition.addListener(({ value }) => {
    if (layoutTimeLine) {
      setPositionMillisCurrent((value / layoutTimeLine.width) * durationMillis);
    }
  });
  const sizePoint = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (layoutTimeLine) {
      //&& !isAnimation) {
      // if (Math.abs(positionMillisCurrent - positionMillis) > 1000) {
      //   setIsAnimation(true);
      //   Animated.timing(currentPosition, {
      //     toValue: (positionMillis / durationMillis) * layoutTimeLine.width,
      //     useNativeDriver: false,
      //     duration: 800,
      //   }).start(() => {
      //     setIsAnimation(false);
      //   });
      // } else {
      currentPosition.setValue(
        (positionMillis / durationMillis) * layoutTimeLine.width
      );
      // }
    }
  }, [positionMillis, durationMillis, layoutTimeLine?.width]); //, isAnimation]);

  const pointGesture = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          Animated.timing(currentPosition, {
            toValue: gestureState.moveX,
            duration: 100,
            useNativeDriver: false,
          }).start();

          return true;
        },
        onPanResponderGrant: (_, gestureState) => {
          Animated.timing(sizePoint, {
            toValue: 2,
            duration: 100,
            useNativeDriver: false,
          }).start();
          setIsEditPositionMillisCurrent(true);
          audioControlContext?.audioControl.onEditTimeStart();
        },
        onPanResponderMove: (_, gestureState) => {
          if (layoutTimeLine) {
            const locationX = gestureState.moveX - layoutTimeLine.x;
            if (locationX >= 0 && locationX <= layoutTimeLine.width) {
              currentPosition.setValue(locationX);
            }
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          Animated.timing(sizePoint, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }).start();
          if (layoutTimeLine) {
            const locationX = gestureState.moveX - layoutTimeLine.x;
            setIsEditPositionMillisCurrent(false);
            audioControlContext?.audioControl.onEditTimeFinish(
              (durationMillis * locationX) / layoutTimeLine.width
            );
          }
        },
      }),
    [layoutTimeLine]
  );

  const lastTime = useMemo(() => {
    let minutes: number;
    let seconds: number;
    if (isEditPositionMillisCurrent) {
      minutes = Math.floor(positionMillisCurrent / 60000);
      seconds = Math.floor((positionMillisCurrent % 60000) / 1000);
    } else {
      minutes = Math.floor(positionMillis / 60000);
      seconds = Math.floor((positionMillis % 60000) / 1000);
    }
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, [positionMillis, isEditPositionMillisCurrent, positionMillisCurrent]);
  return (
    <>
      <Animated.View
        style={[
          styles.timeLine,

          {
            width: "100%",
            transform: [{ scaleY: sizePoint }],
          },
        ]}
        {...pointGesture.panHandlers}
        onLayout={({ nativeEvent: { layout } }) => {
          setLayoutTimeLine(layout);
        }}
      >
        <Animated.View
          style={[
            styles.timeLine,
            {
              width: currentPosition,
              borderColor: colors.white,
              backgroundColor: colors.white,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.point,
            {
              transform: [
                { translateX: currentPosition },
                { scaleX: sizePoint },
              ],
            },
          ]}
        />
      </Animated.View>
      <View style={styles.timeCodeBackground}>
        <Text style={styles.timeCodeColor}>{lastTime}</Text>
        <Text style={styles.timeCodeColor}>
          {Math.floor(durationMillis / 60000)}:
          {durationMillis % 60000 < 10
            ? "0" + Math.floor((durationMillis % 60000) / 1000)
            : Math.floor((durationMillis % 60000) / 1000)}
        </Text>
      </View>
    </>
  );
};

interface TimeLineProps extends ViewProps {
  durationMillis: number;
  positionMillis: number;
}

const styles = StyleSheet.create({
  timeLine: {
    position: "absolute",
    height: 5,
    backgroundColor: "rgba(255,255,255, 0.3)",
    borderColor: "rgba(255,255,255, 0.3)",
    borderWidth: 2,
    borderRadius: 165,
    flexDirection: "row",
    alignSelf: "center",
  },
  point: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "rgba(255,255,255, 0.3)",
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    left: -10,
  },
  timeCodeBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  timeCodeColor: {
    fontSize: 14,
    color: colors.white,
    ...style.getFontOption("400"),
  },
});

export default TimeLine;
