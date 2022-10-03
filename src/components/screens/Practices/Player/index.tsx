import React, {
  ElementRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { ColorButton, TimeLine, FavoriteMeditation } from "~components/dump";
import { useMeditationContext, BackgroundSound } from "~modules/meditation";

import useAnimation from "./animated";

import Headphones from "./assets/Headphones.svg";
import ArrowRight from "./assets/arrowRight.svg";
import ArrowLeft from "./assets/arrowLeft.svg";
import Pause from "./assets/pause.svg";
import Play from "./assets/Play.svg";
import type { MeditationPracticesScreenProps } from "~routes/index";
import { useFocusEffect } from "@react-navigation/native";

const PlayerScreen: MeditationPracticesScreenProps<"PlayerScreen"> = ({
  navigation,
}) => {
  const { meditation } = useMeditationContext();
  const { width } = useWindowDimensions();
  const [positionMilliseconds, setPositionMilliseconds] =
    useState<string>("NaN");
  const [editPositionMilliseconds, setEditPositionsMilliseconds] = useState<
    string | null
  >(null);

  const {
    aStyle,
    hiddenSetButtonTime,
    hiddenTimer,
    opernTimer,
    showSetButtonTime,
  } = useAnimation(width);

  const [isPlaying, setIsPlaying] = useState<boolean>(meditation.isPlaying);
  const TimeLineRef = useRef<ElementRef<typeof TimeLine>>(null);
  const isPlayingMeditation = useRef<{ current: boolean; prev?: boolean }>({
    current: false,
  });

  const timerLink = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    meditation.setOnUpdateAudioData(
      ({ positionMillis, viewTime, isPlaying, percent }) => {
        setPositionMilliseconds(viewTime);
        TimeLineRef.current?.setValue(percent);
        isPlayingMeditation.current.current = isPlaying;
        setIsPlaying(isPlaying);
      }
    );
  }, [meditation.id]);

  useEffect(() => {
    if (isPlaying) {
      showSetButtonTime();
      timerLink.current = setTimeout(() => {
        if (meditation.isPlaying) {
          opernTimer();
        }
      }, 10000);
    } else {
      hiddenSetButtonTime();
      hiddenTimer();
    }
  }, [isPlaying]);

  const cancelTimer = async () => {
    if (timerLink.current) {
      clearTimeout(timerLink.current);
    }
    hiddenTimer();
    timerLink.current = setTimeout(() => {
      if (meditation.isPlaying) {
        opernTimer();
      }
    }, 10000);
  };

  useFocusEffect(
    useCallback(() => {
      hiddenTimer();
    }, [])
  );

  return (
    <Pressable style={{ flex: 1 }} onPressIn={() => cancelTimer()}>
      <ImageBackground
        source={{
          uri: meditation.image,
        }}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[styles.background, styles.contentWrapper, aStyle.timer]}
        >
          <Text style={styles.timer}>{positionMilliseconds}</Text>
        </Animated.View>
        <Animated.View style={[styles.background, aStyle.player]}>
          <View />
          <Animated.View style={styles.panelControl}>
            <ColorButton
              secondItem={<ArrowLeft style={styles.arrowControll} />}
              styleButton={[styles.buttonControllMeditation]}
              styleText={styles.buttonControllText}
              animationStyle={aStyle.leftButtonControll}
              onPress={() => {
                meditation.editCurrentTime(-15000);
              }}
            >
              15
            </ColorButton>
            <ColorButton
              secondItem={
                isPlaying ? (
                  <Pause style={styles.fixPause} />
                ) : (
                  <Play style={styles.fixPlay} />
                )
              }
              styleButton={[
                styles.buttonControllMeditation,
                styles.buttonControllMeditationBig,
              ]}
              onPress={
                isPlaying ? () => meditation.pause() : () => meditation.play()
              }
            />
            <ColorButton
              secondItem={<ArrowRight style={styles.arrowControll} />}
              styleButton={[styles.buttonControllMeditation]}
              styleText={styles.buttonControllText}
              animationStyle={aStyle.rightButtonControll}
              onPress={() => {
                meditation.editCurrentTime(15000);
              }}
            >
              15
            </ColorButton>
          </Animated.View>

          <View style={styles.timeInfoBox}>
            <TimeLine
              ref={TimeLineRef}
              onChange={(_preccent) => {
                meditation.setPostionMillisecondspercentPercent(_preccent);
              }}
              onStartChange={() => {
                isPlayingMeditation.current.prev =
                  isPlayingMeditation.current.current;
                if (isPlayingMeditation.current.current) {
                  meditation.pause();
                }
              }}
              onEndChange={() => {
                if (
                  isPlayingMeditation.current.prev !== undefined &&
                  isPlayingMeditation.current.prev
                ) {
                  meditation.play();
                  delete isPlayingMeditation.current.prev;
                }
                setEditPositionsMilliseconds(null);
              }}
              onUpdate={(percent) => {
                setEditPositionsMilliseconds(
                  meditation.getLengthTimeFake(percent)
                );
              }}
            />
            <View style={styles.timesCodeBox}>
              <Text style={styles.timeCode} key={"current"}>
                {editPositionMilliseconds ?? positionMilliseconds}
              </Text>
              <Text style={styles.timeCode} key={"all"}>
                {meditation.getLengthTime("mm:ss")}
              </Text>
            </View>
          </View>
          {meditation.isHaveBackground && (
            <ColorButton
              styleButton={styles.buttonBackgroundSound}
              styleText={styles.buttonBackgroundText}
              secondItem={<Headphones style={{ marginRight: 24 }} />}
              onPress={() => {
                navigation.navigate("BackgroundSound");
              }}
            >
              {Tools.i18n.t(
                meditation.nameMeditationBackground !== null
                  ? BackgroundSound[meditation.nameMeditationBackground]
                      .translate
                  : "12ee6d3a-ad58-4c4a-9b87-63645efe9c90"
              )}
            </ColorButton>
          )}
        </Animated.View>
      </ImageBackground>
    </Pressable>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 37,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  timeInfoBox: {
    width: "100%",
    position: "absolute",
    bottom: 95,
    alignSelf: "center",
  },
  timesCodeBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  timeCode: {
    fontSize: 14,
    color: "#FFFFFF",
    ...Tools.gStyle.font("400"),
    opacity: 0.7,
  },
  buttonBackgroundSound: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingRight: 33,
    paddingLeft: 13,
    marginTop: 17,
  },
  buttonBackgroundText: {
    color: "#FFFFFF",
  },
  buttonControllMeditation: {
    backgroundColor: "rgba(61, 61, 61, 0.5)",

    width: 41,
    height: 41,
    borderRadius: 20.5,
    marginHorizontal: 11.5,
  },
  buttonControllMeditationPlay: {},
  buttonControllText: {
    color: "#FFFFFF",
    fontSize: 13,
    ...Tools.gStyle.font("400"),
    transform: [{ translateY: 5 }],
  },
  arrowControll: {
    position: "absolute",
    zIndex: 1,
    transform: [{ translateY: -1 }],
  },
  buttonControllMeditationBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fixPause: {},
  panelControl: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  fixPlay: {
    transform: [{ translateX: 5 }],
  },
  contentWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 48,
    ...Tools.gStyle.font("400"),
    backgroundColor: "rgba(61, 61, 61, 0.5)",
    width: 196,
    height: 196,
    borderRadius: 98,
    color: "#FFFFFF",
  },
  meditationName: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("700"),
    textAlign: "center",
  },
  meditationType: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Tools.gStyle.font("400"),
    textAlign: "center",
  },
});
