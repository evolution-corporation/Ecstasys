import React, { ElementRef, useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, Button, View, Text } from "react-native";

import Tools from "~core";
import { TimeLine } from "~components/dump";
import { useMeditationContext } from "~modules/meditation";

const PlayerScreen = ({}) => {
  const TimeLineRef = useRef<ElementRef<typeof TimeLine>>(null);
  const { meditation } = useMeditationContext();
  const [positionMilliseconds, setPositionMilliseconds] =
    useState<string>("NaN");
  const isPlayingMeditation = useRef<{ current: boolean; prev?: boolean }>({
    current: false,
  });
  useEffect(() => {
    meditation.setOnUpdateAudioData(
      ({ positionMillis, viewTime, isPlaying, percent }) => {
        setPositionMilliseconds(viewTime);
        TimeLineRef.current?.setValue(percent);
        isPlayingMeditation.current.current = isPlaying;
      }
    );
  }, [meditation.id]);

  return (
    <ImageBackground
      source={{
        uri: meditation.image,
      }}
      style={styles.background}
    >
      <View style={styles.timeInfoBox}>
        <Button
          title="играть"
          onPress={() => {
            meditation.play();
          }}
        />
        <Button
          title="пауза"
          onPress={() => {
            meditation.pause();
          }}
        />
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
          }}
        />
        <View style={styles.timesCodeBox}>
          <Text style={styles.timeCode} key={"current"}>
            {positionMilliseconds}
          </Text>
          <Text style={styles.timeCode} key={"all"}>
            {meditation.getLengthTime("mm:ss")}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timeInfoBox: {
    width: "100%",
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
});
