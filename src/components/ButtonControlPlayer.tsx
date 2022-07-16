import React, { FC, forwardRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import style, { colors } from "~styles";
import Icon from "~assets/icons";
import AudioControlContext from "~contexts/audioControl";

const ButtonControlPlayer: FC<ButtonControlPlayerProps> = (props) => {
  const { style } = props;
  const audioControlContext = useContext(AudioControlContext);
  const isLoaded = !audioControlContext?.audioData?.isLoaded;
  const isPlaying = useMemo(
    () => !!audioControlContext?.audioData?.isPlaying,
    [isLoaded, audioControlContext?.audioData]
  );
  if (!audioControlContext) return null;
  return (
    <View style={[styles.playerButton, style]}>
      {isPlaying && (
        <TouchableOpacity
          style={[styles.controlButton, styles.controlPlayButton]}
          onPress={() => audioControlContext.audioControl.addTime(-15000)}
        >
          <Icon name="ControlButton" variable="Left" />
          <Text style={styles.seconds}>15</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.playButton, styles.controlPlayButton]}
        onPress={
          isPlaying
            ? audioControlContext.audioControl.pause
            : audioControlContext.audioControl.play
        }
      >
        {isPlaying ? (
          <Icon name="ControlButton" variable={"Pause"} key={"pause"} />
        ) : (
          <Icon
            name="ControlButton"
            variable={"Play"}
            key={"play"}
            style={styles.PlayFix}
          />
        )}
      </TouchableOpacity>
      {isPlaying && (
        <TouchableOpacity
          style={[styles.controlButton, styles.controlPlayButton]}
          onPress={() => audioControlContext.audioControl.addTime(15000)}
        >
          <Icon name="ControlButton" variable="Right" />
          <Text style={styles.seconds}>15</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ButtonControlPlayerProps extends ViewProps {}

const styles = StyleSheet.create({
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
    marginHorizontal: 23,
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
});

export default ButtonControlPlayer;
