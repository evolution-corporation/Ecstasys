import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "~assets/icons";
import i18n from "~i18n";
import style, { colors } from "~styles";
import EditFavoriteStatusMeditation from "./EditFavoriteStatusMeditation";

const MeditationCard: FC<Props> = (props) => {
  const { meditation, type = "full", isBlocked = false, onPress } = props;
  // const navigation = useNavigation<
  //   RootStackScreenProps,
  //   "MeditationListener"
  // >();

  // const openPlayer = () =>
  //   navigation.navigate("MeditationListener", {
  //     meditationID: meditation.id,
  //   });

  if (type == "compact") {
    return (
      <ImageBackground
        source={{ uri: meditation.image }}
        style={[
          styles.imageMeditationCompact,
          isBlocked
            ? { alignItems: "center", justifyContent: "center" }
            : { justifyContent: "flex-end" },
        ]}
      >
        {isBlocked ? (
          <View style={styles.blockedIcon}>
            <Icon name={"Lock"} />
          </View>
        ) : (
          <View style={styles.containerImageCompact}>
            <Text style={styles.timeFontCompact}>
              {i18n.getTime(meditation.lengthAudio / 60, "minute")}
            </Text>
            <EditFavoriteStatusMeditation id={meditation.id} onlyView />
          </View>
        )}
      </ImageBackground>
    );
  }

  return (
    <TouchableOpacity onPress={onPress ?? console.log}>
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
          <Icon name="Play" variable="violet" />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

interface Props extends ViewProps {
  meditation: MeditationData;
  onPress?: () => void;
  type?: "full" | "compact";
  isBlocked?: boolean;
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
  imageMeditationCompact: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    ...style.getShadows(2, 3),
    overflow: "hidden",
    // paddingBottom: 17,
    zIndex: 1,
  },
  containerImageCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
    alignItems: "flex-end",
    marginHorizontal: 14,
    marginBottom: 17,
  },
  timeFontCompact: {
    fontSize: 13,
    color: colors.white,
    ...style.getFontOption("600"),
  },
  blockedIcon: {
    height: 110,
    width: 110,
    backgroundColor: "rgba(0,0,0,0.49)",
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MeditationCard;
