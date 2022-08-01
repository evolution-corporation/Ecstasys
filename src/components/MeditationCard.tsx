import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { getMeditationData } from "~api/meditation";
import Icon from "~assets/icons";
import useIsServerAccess from "~hooks/useIsServerAccess";
import i18n from "~i18n";
import style, { colors } from "~styles";
import EditFavoriteStatusMeditation from "./EditFavoriteStatusMeditation";

const MeditationCard: FC<Props> = (props) => {
  const { type = "full", isBlocked = false } = props;
  const serverAccess = useIsServerAccess();
  const [meditation, setMeditation] = useState(props.meditation);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      !meditation.description ||
      !meditation.image ||
      !meditation.permission ||
      !meditation.type ||
      !meditation.name ||
      !meditation.lengthAudio
    ) {
      if (serverAccess) {
        setIsLoading(true);
        getMeditationData(meditation.id).then(() => {
          setMeditation(meditation);
          setIsLoading(false);
        });
      }
    }
  }, [meditation]);

  const navigation = useNavigation();

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

  if (type == "compact-vertical") {
    return (
      <TouchableOpacity style={props.style}>
        <View style={styles.imageCompactVertical}>
          <Image
            source={
              serverAccess
                ? { uri: meditation.image }
                : require("~assets/notFoundImage.jpeg")
            }
            style={{ width: 140, height: 183 }}
          />
        </View>
        <Text style={styles.textCompactVertical}>{meditation.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MeditationListener", {
          meditationID: meditation.id,
        })
      }
    >
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
  type?: "full" | "compact" | "compact-vertical";
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
  imageCompactVertical: {
    borderRadius: 20,
    ...style.getShadows(2, 3),
    marginBottom: 4,
    overflow: "hidden",
  },
  textCompactVertical: {
    color: colors.white,
    fontSize: 16,
    ...style.getFontOption("600"),
  },
});

export default MeditationCard;
