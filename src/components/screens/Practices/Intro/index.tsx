import React, { ElementRef, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import Swiper from "react-native-swiper";

import Core from "~core";
import { ColorButton, TextButton } from "~components/dump";

import useAnimation from "./animation";
import Arrow from "./assets/Arrow.svg";
import ArrowLeft from "./assets/arrowLeft.svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { RootScreenProps } from "~routes/index";

const swiperContent = [
  {
    name: "relaxation",
    title: "relaxation",
    text: "7b205d68-98a8-4f07-8a4c-347fe65a0961",
    image: require("./assets/relax.png"),
  },
  {
    name: "visualizations",
    title: "directionalVisualizations",
    text: "0808c3b7-8eda-403a-8b7d-515aa50c7723",
    image: require("./assets/Visualizations.png"),
  },
  {
    name: "breath",
    title: "6190a615-02b9-4860-91bd-f2d94c0a8849",
    text: "0894c96e-83bf-4c27-b498-c3d6b51251b5",
    image: require("./assets/breath.png"),
  },
  {
    name: "base",
    title: "baseMeditation",
    text: "4cb7de64-0c26-4200-af9d-0e2cb533760c",
    image: require("./assets/base.png"),
  },
  {
    name: "dmd",
    title: "385cfdf2-c360-404a-8618-cb65583957c0",
    text: "d810ec3c-1d46-48b3-ba30-45e135dcad44",
    image: require("./assets/dmd.png"),
  },
];

const IntroPracticesScreen: RootScreenProps<"IntroPractices"> = ({
  navigation,
}) => {
  const { aStyle, firstPage, twoPage } = useAnimation();
  const [isGreeting, setIsGreeting] = useState<boolean>(true);
  const refSwiper = useRef<ElementRef<typeof Swiper>>(null);
  const indexSwiper = useRef<number>(0);

  return (
    <View style={styles.background}>
      <Animated.View style={[styles.birdProffessor, aStyle.bird]}>
        <Image source={require("./assets/BirdProfessor.png")} />
      </Animated.View>
      {isGreeting && <View style={{ flex: 2 }} />}
      <View style={{ flex: 1 }}>
        {isGreeting ? (
          <>
            <Text style={styles.title}>
              {Core.i18n.t("3410ac11-a61b-49f7-b7e4-3bbc2998f1c2")}
            </Text>
            <Text style={styles.text}>
              {Core.i18n.t("42ccdb27-d3ef-4a77-89bf-89138155211e")}
            </Text>
          </>
        ) : (
          <Swiper
            dotColor={"rgba(231, 221, 236, 0.5))"}
            activeDotColor={"#E7DDEC"}
            loop={false}
            ref={refSwiper}
            onIndexChanged={(index) => {
              indexSwiper.current = index;
            }}
          >
            {swiperContent.map((item) => (
              <View key={item.name} style={styles.card}>
                <Image source={item.image} style={styles.logoCategory} />
                <Text
                  style={[
                    styles.titleCategory,
                    item.name === "dmd" ? { width: 400 } : null,
                  ]}
                >
                  {Core.i18n.t(item.title)}
                </Text>
                <Text style={styles.textCategory}>
                  {Core.i18n.t(item.text)}
                </Text>
              </View>
            ))}
          </Swiper>
        )}
      </View>
      <View style={styles.buttonControl}>
        {isGreeting ? (
          <TextButton
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            {Core.i18n.t("skip")}
          </TextButton>
        ) : (
          <Pressable
            onPress={() => {
              if (indexSwiper.current === 0) {
                firstPage();
                setIsGreeting(true);
              } else {
                refSwiper.current?.scrollBy(-1);
              }
            }}
          >
            <ArrowLeft />
          </Pressable>
        )}
        <ColorButton
          secondItem={<Arrow />}
          styleButton={styles.buttonNext}
          onPress={() => {
            if (isGreeting) {
              twoPage();
              setIsGreeting(false);
            } else {
              if (indexSwiper.current + 1 < swiperContent.length) {
                refSwiper.current?.scrollBy(1);
              } else {
                navigation.navigate("TabNavigator", {
                  screen: "PracticesList",
                });
              }
            }
          }}
        />
      </View>
    </View>
  );
};

export default IntroPracticesScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
    // paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: "#FFFFFF",
  },
  birdProffessor: {
    position: "absolute",

    left: 0,
    bottom: 0,
  },
  title: {
    color: "#3D3D3D",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 20,
  },
  text: {
    color: "rgba(64, 64, 64, 0.71)",
    marginHorizontal: 20,
    fontSize: 16,
    ...Core.gStyle.font("400"),
    marginTop: 26,
  },
  buttonControl: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: 45,
    paddingHorizontal: 20,
  },
  buttonNext: {
    backgroundColor: "#9765A8",
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  logoCategory: {
    width: "100%",
  },
  card: {
    alignItems: "center",
  },
  titleCategory: {
    color: "#3D3D3D",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginVertical: 16,
    textAlign: "center",
    width: 180,
  },
  textCategory: {
    color: "rgba(64, 64, 64, 0.71)",
    fontSize: 16,
    lineHeight: 22,
    ...Core.gStyle.font("400"),
    textAlign: "center",
    marginHorizontal: 20,
  },
});
