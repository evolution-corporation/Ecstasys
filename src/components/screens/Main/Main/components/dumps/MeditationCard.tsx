import React, { FC, useState } from "react";
import {
  Image,
  ViewProps,
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Tools from "~core";
import type { MainCompositeStackNaviatorProps } from "~routes/index";
import { TypeMeditation } from "~modules/meditation/types";

var height = Dimensions.get("window").height;

export const MeditationCard: FC<MeditationCardProps> = (props) => {
  const { name, description, image, isCustomTime = false, time, id } = props;
  const navigation = useNavigation<MainCompositeStackNaviatorProps>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <Pressable
      style={styles.background}
      onPress={() => {
        navigation.navigate("ListenMeditation", {
          meditationId: id,
        });
      }}
    >
      <Image
        source={{ uri: image }}
        style={styles.backgroundContainer}
        resizeMode={"cover"}
      />
      <View
        style={{
          backgroundColor: "rgba(0,0,0, 0.2)",
          flex: 1,
          justifyContent: "space-between",
        }}
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
              size={30}
              color={"#702D87"}
              style={{ transform: [{ translateX: 2.5 }] }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export interface MeditationCardProps extends ViewProps {
  meditation: {
    id: string;
    name: string;
    description: string;
    lengthAudio: number;
    image: string;
    isCustomTime: boolean;
  } | null;
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    height: height * 0.256,
  },
  backgroundContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  textInformation: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  title: {
    color: "#FFFFFF",
    fontSize: height * 0.026,
    lineHeight: 23,
    ...Tools.gStyle.font("600"),
  },
  description: {
    color: "#FFFFFF",
    fontSize: height * 0.02,
    lineHeight: 20,
    ...Tools.gStyle.font("400"),
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
    fontSize: height * 0.018,
    ...Tools.gStyle.font("600"),
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
