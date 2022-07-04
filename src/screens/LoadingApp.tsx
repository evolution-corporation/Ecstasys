import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Background from "~components/BackgroundGradient";
import Logo from "~assets/icons/LogoApp.svg";

const LoadingApp: React.FC = () => (
  <Background style={styles.background} isImage={true}>
    <View style={{ alignItems: "center" }}>
      <Logo />
      <Text style={styles.title}>ecstasys</Text>
      <Text style={styles.subTitle}>from Kozlov</Text>
      <ActivityIndicator color={"#FFFFFF"} size={"large"} />
    </View>
  </Background>
);

const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Gilroy",
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subTitle: {
    fontFamily: "Gilroy",
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 8,
  },
});

export default LoadingApp;
