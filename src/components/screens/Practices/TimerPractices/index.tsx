//! 50% Не работает нормально
//TODO: требуется рефракторинг

import React, { useState } from "react";

import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ColorButton } from "~components/dump";

import Core from "~core";
import { useMeditationContext } from "~modules/meditation";

import { ScrollTime } from "./components";

const TimerPractices = () => {
  const { meditation } = useMeditationContext();
  const [timeMilleseconds, setTimeMilleseconds] = useState<number>(6);

  const setLength = () => {
    meditation.setLengthMeditation(timeMilleseconds);
  };

  return (
    <View style={styles.background}>
      <ImageBackground source={{ uri: meditation.image }} style={styles.image}>
        <Text>{}</Text>
      </ImageBackground>
      <Text style={styles.mainText}>
        {Core.i18n.t("e233a33c-3f87-4695-b7ac-29d57ff11ad2")}{" "}
        <Text style={styles.boldMainText}>
          {Core.i18n.t("399ca325-5376-44e1-8767-f07451e209e8")}
        </Text>
      </Text>
      <ScrollTime
        onChange={(time) => {
          setTimeMilleseconds((time.minutes * 60 + time.seconds) * 1000);
          console.log((time.minutes * 60 + time.seconds) * 1000);
        }}
      />
      <View style={{ width: "100%" }}>
        <ColorButton
          styleButton={styles.buttonView}
          styleText={styles.buttonText}
          onPress={() => {
            setLength();
          }}
        >
          {Core.i18n.t("c45a8d0b-dca1-46d8-8110-6fe268acabfd")}
        </ColorButton>
      </View>
    </View>
  );
};

export default TimerPractices;

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 20,
    paddingBottom: 55,
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height / 2.2,
    ...Core.gStyle.shadows(2, 3),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  mainText: {
    marginTop: 18,
    color: "#3D3D3D",
    fontSize: 14,
    ...Core.gStyle.font("400"),
    textAlign: "center",
    lineHeight: 16.41,
    width: 340,
  },
  boldMainText: {
    ...Core.gStyle.font("600"),
  },
  buttonView: {
    backgroundColor: "#9765A8",
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});
