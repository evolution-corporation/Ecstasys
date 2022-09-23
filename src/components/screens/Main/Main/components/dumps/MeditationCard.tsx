import React, { FC } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  ViewProps,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Tools from "~core";
import type { MainCompositeStackNaviatorProps } from "~routes/index";
import { TypeMeditation } from "~modules/meditation/types";

export const MeditationCard: FC<MeditationCardProps> = (props) => {
  const { name, description, image, isCustomTime = false, time, id } = props;
  const navigation = useNavigation<MainCompositeStackNaviatorProps>();
  return (
    <TouchableOpacity
      style={styles.background}
      onPress={() => {
        navigation.navigate("ListenMeditation", {
          meditationId: id,
        });
      }}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.backgroundContainer}
        resizeMode={"stretch"}
      >
        <View style={styles.textInformation}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.bottomInformation}>
          <Text style={styles.timeLength}>
            {isCustomTime
              ? Tools.i18n.t("baacc210-74b7-44f0-b59c-b08733b51adc")
              : Tools.i18n.t("minute", {
                  count: Math.floor(time / (60 * 1000)),
                })}
          </Text>
          <View style={styles.buttonPlay}>
            <Entypo
              name={"controller-play"}
              size={40}
              color={"#702D87"}
              style={{ transform: [{ translateX: 2.5 }] }}
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export interface MeditationCardProps extends ViewProps {
  name: string;
  description: string;
  image: string;
  isCustomTime?: boolean;
  time: number;
  id: string;
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  backgroundContainer: {
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  textInformation: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 23,
    ...Tools.gStyle.font("600"),
  },
  description: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 15,
    ...Tools.gStyle.font("500"),
    marginTop: 8,
  },
  bottomInformation: {
    paddingHorizontal: 20,
    paddingBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLength: {
    height: 30,
    backgroundColor: "#9765A8",
    borderRadius: 15,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
    paddingHorizontal: 30,
    textAlignVertical: "center",
  },
  buttonPlay: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
