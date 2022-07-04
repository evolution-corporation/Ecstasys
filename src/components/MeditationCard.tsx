import React, { FC } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "~assets/icons";
import i18n from "~i18n";
import Meditation from "~models/Meditation";
import style, { colors } from "~styles";

const MeditationCard: FC<Props> = (props) => {
  const { meditation } = props;
  return (
    <ImageBackground
      source={{ uri: meditation.image }}
      {...props}
      style={[styles.background, props.style]}
    >
      <View>
        <Text style={styles.title}>{meditation.name}</Text>
        <Text style={styles.description}>{meditation.description}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.lengthAudio}>
          {i18n.getTime(meditation.lengthAudio / 60, "minute")}
        </Text>
        <TouchableOpacity onPress={props.onPress}>
          <Icon name="Play" variable="violet" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

interface Props extends ViewProps {
  meditation: Meditation;
  onPress?: () => void;
}

const paddingVertical = 20;
const paddingHorizontal = 20;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: 200,
    borderRadius: 20,
    paddingHorizontal: paddingHorizontal,
    paddingVertical: paddingVertical,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  title: {
    color: colors.white,
    ...style.getFontOption("600"),
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    color: colors.white,
    ...style.getFontOption("500"),
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lengthAudio: {
    borderRadius: 15,
    backgroundColor: colors.StrokePanel,
    height: 30,
    width: 125,
    textAlign: "center",
    textAlignVertical: "center",
    color: colors.white,
    ...style.getFontOption("600"),
    fontSize: 16,
    // position: "absolute",
    // bottom: paddingVertical,
    // left: paddingHorizontal,
  },
  buttonPlay: {},
});

export default MeditationCard;
