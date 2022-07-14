import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import style, { colors } from "~styles";
import ButtonControlPlayer from "~components/ButtonControlPlayer";
import TimeLine from "~components/TimeLine";
import useAudio from "~hooks/useAudio";
import AudioControlContext from "~contexts/audioControl";

const PlayerScreen: FC<
  NativeStackScreenProps<MeditationListenerParametersList, "Player">
> = ({ route, navigation }) => {
  const audioData = useContext(AudioControlContext);
  // if (!audioData?.isLoaded || !meditationData || !audioData) {
  //   return (
  //     <Animated.View
  //       entering={FadeIn}
  //       exiting={FadeOut}
  //       style={styles.background}
  //     >
  //       <ActivityIndicator color={colors.white} size={"large"} />
  //     </Animated.View>
  //   );
  // }
  if (!audioData) return null;
  return (
    <ImageBackground
      source={{ uri: route.params.image }}
      style={styles.background}
    >
      <ButtonControlPlayer />
      <View style={styles.bottomView}>
        <TimeLine
          durationMillis={audioData.audioData.durationMillis ?? 0}
          positionMillis={audioData.audioData.positionMillis}
        />
      </View>
    </ImageBackground>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.violet,
    justifyContent: "center",
    alignItems: "center",
  },

  playerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  controlPlayButton: {
    backgroundColor: "rgba(61, 61, 61, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  controlButton: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
  },
  PlayFix: {
    transform: [{ translateX: 4 }],
  },
  seconds: {
    position: "absolute",
    bottom: 5,
    color: colors.white,
    fontSize: 13,
    ...style.getFontOption("400"),
    opacity: 0.7,
  },
  bottomView: {
    paddingHorizontal: 30,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
});
