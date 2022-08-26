import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, Image, View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { TextButton } from "~components/dump";

import useAnimation from "./animated";
import { ArrowButtonMask, ArrowButton } from "./components";

const IntroScreen = () => {
  const { aStyles, setNextValue, setPrevValue } = useAnimation();
  const [text, setText] = useState<{ title: string; description: string }>({
    title: Tools.i18n.t("ff867b49-717d-4611-a2b2-22349439f76f"),
    description: Tools.i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29"),
  });
  const [isShowNameApp, setIsShowNameApp] = useState<boolean>(true);
  const [isShowSkipButton, setIsShowSkipButton] = useState<boolean>(true);
  const nextPage = useCallback(async () => {
    setNextValue();
    setText({
      title: Tools.i18n.t("4175a7b2-df02-4842-afe5-6146715a6db0"),
      description: Tools.i18n.t("d2959f34-68cc-43a2-b1f0-ffb8d429b418"),
    });
    setIsShowNameApp(false);
    setIsShowSkipButton(false);
  }, []);

  const prevPage = useCallback(async () => {
    setPrevValue();
    setText({
      title: Tools.i18n.t("ff867b49-717d-4611-a2b2-22349439f76f"),
      description: Tools.i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29"),
    });
    setIsShowNameApp(true);
    setIsShowSkipButton(true);
  }, []);

  return (
    <Animated.View style={[aStyles.background, styles.background]}>
      <Animated.View style={[aStyles.professor, styles.professor]}>
        <Image source={require("./assets/professor.png")} />
      </Animated.View>
      <Animated.View style={[aStyles.bird, styles.bird]}>
        <Image
          source={require("./assets/bird.png")}
          resizeMethod={"resize"}
          resizeMode={"contain"}
          style={{ maxWidth: Dimensions.get("window").width - 120 }}
        />
      </Animated.View>
      <View style={styles.text}>
        <Animated.Text style={[aStyles.title, styles.title]}>
          {text.title}
          {isShowNameApp && (
            <Text style={{ color: "#9765A8" }}>DMD Meditation!</Text>
          )}
        </Animated.Text>
        <Animated.Text style={[aStyles.description, styles.description]}>
          {text.description}
        </Animated.Text>
        <View style={styles.menuButton}>
          {isShowSkipButton ? (
            <TextButton text={Tools.i18n.t("skip")} />
          ) : (
            <ArrowButton onPress={() => prevPage()} />
          )}
          <ArrowButtonMask
            backgroundColor={aStyles.button.backgroundColor}
            color={aStyles.button.color}
            onPress={() => nextPage()}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingBottom: 25,
  },
  professor: {
    position: "absolute",
    zIndex: 2,
  },
  bird: {
    alignSelf: "center",
    flex: 3,
  },
  title: {
    fontSize: 32,
    textAlign: "left",
    fontFamily: "Gilroy",
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    ...Tools.gStyle.font("400"),
    color: "#404040",
    opacity: 0.71,
    lineHeight: 22.4,
    marginVertical: 26,
  },
  text: {
    flex: 2,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default IntroScreen;
