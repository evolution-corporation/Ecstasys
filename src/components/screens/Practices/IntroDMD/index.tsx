import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

import Core from "~core";
import { ColorButton } from "~components/dump";

const IntroDMD = () => {
  return (
    <View style={styles.background}>
      <Image source={require("./assets/professor.png")} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>
          {Core.i18n.t("cf6383b7-a22c-40c2-8c3f-0d107ea6d089")}
        </Text>
        <Text style={styles.text}>
          {Core.i18n.t("0565784b-4add-4cec-9600-251ac3cee448")}
        </Text>
        <ColorButton styleButton={styles.button} styleText={styles.buttonText}>
          {Core.i18n.t("cbe3cadd-63a1-4295-99a3-d66bc332c399")}
        </ColorButton>
      </View>
    </View>
  );
};

export default IntroDMD;

const styles = StyleSheet.create({
  background: {},
  image: {
    width: "100%",
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    color: "#3D3D3D",
    fontFamily: "Inter_700Bold",
    fontSize: 32,
  },
  text: {
    marginTop: 30,
    color: "rgba(64, 64, 64, 0.71)",
    fontSize: 16,
    ...Core.gStyle.font("400"),
  },
  button: {
    backgroundColor: "rgba(194, 169, 206, 1)",
    borderRadius: 15,
    marginTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
