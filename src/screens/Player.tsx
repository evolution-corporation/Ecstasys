import React, { FC, useContext } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import style, { colors } from "~styles";
import ButtonControlPlayer from "~components/ButtonControlPlayer";
import TimeLine from "~components/TimeLine";
import useAudio from "~hooks/useAudio";
import AudioControlContext from "~contexts/audioControl";
import Icon from "~assets/icons";
import i18n from "~i18n";

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
  if (!audioData?.audioData) return null;
  const openBackgroundMusicMenu = () => {
    navigation.navigate("BackgroundMusic");
  };
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
      <TouchableOpacity
        style={styles.backgroundMusicMenu}
        onPress={openBackgroundMusicMenu}
      >
        <Icon name={"Headphones"} variable={"white"} />
        <Text style={styles.backgroundMusicName}>
          {audioData.backgroundMusicName
            ? i18n.getBackgroundMusicImage(audioData.backgroundMusicName)
            : i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90")}
        </Text>
      </TouchableOpacity>
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
  backgroundMusicMenu: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 41,
    borderRadius: 20.5,
    paddingHorizontal: 13,
    width: "auto",

    position: "absolute",
    left: 30,

    bottom: 40,
  },
  backgroundMusicName: {
    color: colors.white,
    fontSize: 14,
    ...style.getFontOption("400"),
    marginLeft: 24,
  },
});
