import React, { ElementRef, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Image,
  Pressable,
} from "react-native";

import {
  useMeditationContext,
  BackgroundSound,
  playFragmentMeditationBackground,
} from "~modules/meditation";
import { TimeLine } from "~components/dump";
import Tools from "~core";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";

import type { MeditationPracticesScreenProps } from "src/routes";

const BackgroundSoundSreen: MeditationPracticesScreenProps<
  "BackgroundSound"
> = ({ navigation }) => {
  const { meditation } = useMeditationContext();
  const TimeLineRef = useRef<ElementRef<typeof TimeLine>>(null);
  const [selectedBackgroundSoung, setSelectedBackgroundSoung] = useState<
    keyof typeof BackgroundSound | null
  >(meditation.nameMeditationBackground);
  const offPlayBackgroundSound = useRef<{ (): Promise<void> } | null>(null);
  const [zIndexMax, setZIndexMax] = useState<
    keyof typeof BackgroundSound | null
  >(null);

  const heightHeade = useHeaderHeight();

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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.title}>
          {Tools.i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90")}
        </Text>
      ),

      headerTransparent: true,
      headerTitleAlign: "center",
      headerTintColor: "#FFFFFF",
    });
  }, [setSelectedBackgroundSoung]);

  const scalePressable: { [index: string]: SharedValue<number> } = {};
  const aStyle: { [index: string]: any } = {};

  for (let nameBackgroundSound of Object.keys(BackgroundSound)) {
    scalePressable[nameBackgroundSound] = useSharedValue(1);
    aStyle[nameBackgroundSound] = useAnimatedStyle(() => ({
      transform: [
        { scale: withTiming(scalePressable[nameBackgroundSound].value) },
      ],
    }));
  }

  return (
    <ImageBackground
      blurRadius={2}
      source={{ uri: meditation.image }}
      style={styles.background}
    >
      <View style={[styles.contentWrapper, { paddingTop: heightHeade }]}>
        <View style={styles.backgroundSoundList}>
          {Object.entries(BackgroundSound).map((item) => (
            <Pressable
              style={{ zIndex: item[0] === zIndexMax ? 2 : 1 }}
              key={item[0]}
              onPress={() => {
                setSelectedBackgroundSoung(
                  selectedBackgroundSoung === item[0]
                    ? null
                    : (item[0] as keyof typeof BackgroundSound)
                );
              }}
              onLongPress={async () => {
                setZIndexMax(item[0] as keyof typeof BackgroundSound);
                scalePressable[item[0]].value = 2;
                offPlayBackgroundSound.current =
                  await playFragmentMeditationBackground(
                    item[0] as keyof typeof BackgroundSound
                  );
              }}
              onPressOut={async () => {
                if (offPlayBackgroundSound.current !== null) {
                  await offPlayBackgroundSound.current();
                  offPlayBackgroundSound.current = null;
                }
                scalePressable[item[0]].value = 1;
              }}
            >
              <Animated.View style={aStyle[item[0]]}>
                <Image
                  source={item[1].image}
                  style={[
                    styles.iconBackgroundSound,
                    selectedBackgroundSoung === item[0]
                      ? { borderColor: "#FFFFFF", borderWidth: 2 }
                      : null,
                  ]}
                />
                <Text style={styles.nameBackgroundSound}>
                  {Tools.i18n.t(item[1].translate)}
                </Text>
              </Animated.View>
            </Pressable>
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
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("700"),
    textAlign: "center",
  },
});
