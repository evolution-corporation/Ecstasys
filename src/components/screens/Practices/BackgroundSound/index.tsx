import React, { ElementRef, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, ImageBackground, View, Image } from "react-native";

import { useMeditationContext, BackgroundSound } from "~modules/meditation";
import { TimeLine } from "~components/dump";
import Tools from "~core";
import { TouchableOpacity } from "react-native-gesture-handler";

const BackgroundSoundSreen = () => {
  const { meditation } = useMeditationContext();
  const TimeLineRef = useRef<ElementRef<typeof TimeLine>>(null);
  const [selectedBackgroundSoung, setSelectedBackgroundSoung] = useState<
    keyof typeof BackgroundSound | null
  >(meditation.nameMeditationBackground);

  useEffect(() => {
    TimeLineRef.current?.setValue(meditation.backgroundSoundVolume);
    return () => {};
  }, [meditation.backgroundSoundVolume]);

  useEffect(() => {
    console.log(selectedBackgroundSoung, meditation.nameMeditationBackground);
    if (
      selectedBackgroundSoung &&
      selectedBackgroundSoung !== meditation.nameMeditationBackground
    ) {
      meditation.setMeditationBackground(selectedBackgroundSoung);
    } else if (selectedBackgroundSoung === null) {
      meditation.unsetMeditationBackground();
    }
  }, [selectedBackgroundSoung]);

  return (
    <ImageBackground
      blurRadius={2}
      source={{ uri: meditation.image }}
      style={styles.background}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.backgroundSoundList}>
          {Object.entries(BackgroundSound).map((item) => (
            <TouchableOpacity
              key={item[0]}
              onPress={() => {
                setSelectedBackgroundSoung(
                  selectedBackgroundSoung === item[0]
                    ? null
                    : (item[0] as keyof typeof BackgroundSound)
                );
              }}
            >
              <Image
                source={item[1].image}
                style={styles.iconBackgroundSound}
              />
              <Text style={styles.nameBackgroundSound}>
                {Tools.i18n.t(item[1].translate)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TimeLine
          ref={TimeLineRef}
          onChange={(percent) => {
            meditation.setVolumeBackgroundSound(percent);
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default BackgroundSoundSreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backgroundSoundList: {
    flexDirection: "row",
  },
  iconBackgroundSound: {
    borderRadius: 20,
    width: 65,
    height: 65,
    marginHorizontal: 12,
    marginVertical: 11,
  },
  nameBackgroundSound: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    ...Tools.gStyle.font("500"),
  },
});
