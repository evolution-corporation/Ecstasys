import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { TextButton } from "~components/dump";

import useAnimation from "./animated";
import { ArrowButtonMask, ArrowButton } from "./components";
import { RootScreenProps } from "~types";
var height = Dimensions.get("window").height;

const IntroScreen: RootScreenProps<"Intro"> = ({ navigation }) => {
  const { aStyles, setNextValue, setPrevValue } = useAnimation();
  const [text, setText] = useState<{ title: string; description: string }>({
    title: Tools.i18n.t("ff867b49-717d-4611-a2b2-22349439f76f"),
    description: Tools.i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29"),
  });
  const [isShowNameApp, setIsShowNameApp] = useState<boolean>(true);
  const [isShowSkipButton, setIsShowSkipButton] = useState<boolean>(true);

  const indexPage = useRef<number>(0);

  const nextPage = useCallback(async () => {
    if (indexPage.current === 1) {
      navigation.navigate("SelectMethodAuthentication");
    } else {
      indexPage.current = 1;
      setNextValue();
      setText({
        title: Tools.i18n.t("4175a7b2-df02-4842-afe5-6146715a6db0"),
        description: Tools.i18n.t("d2959f34-68cc-43a2-b1f0-ffb8d429b418"),
      });
      setIsShowNameApp(false);
      setIsShowSkipButton(false);
    }
  }, []);

  const prevPage = useCallback(async () => {
    indexPage.current = 0;
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
        <Image
          source={require("./assets/professor.png")}
          resizeMode={"contain"}
          style={{ height: height * 0.57 }}
        />
      </Animated.View>
      <Animated.View style={[aStyles.bird, styles.bird]}>
        <Image
          source={require("./assets/bird.png")}
          resizeMethod={"resize"}
          resizeMode={"contain"}
          style={{ maxWidth: Dimensions.get("window").width - 100 }}
        />
      </Animated.View>
      <View style={styles.text}>
        <Animated.Text
          style={[aStyles.title, styles.title]}
          adjustsFontSizeToFit
        >
          {text.title}
          {isShowNameApp && (
            <Text style={{ color: "#9765A8", fontFamily: "Inter_700Bold" }}>
              {"\n"}dmd meditation!
            </Text>
          )}
        </Animated.Text>
        <Animated.Text
          style={[aStyles.description, styles.description]}
          adjustsFontSizeToFit
          onLayout={({ nativeEvent: { layout } }) => {}}
        >
          {text.description}
        </Animated.Text>
        <View style={styles.menuButton}>
          {isShowSkipButton ? (
            <TextButton
              styleText={styles.skipButton}
              onPress={() => {
                navigation.navigate("SelectMethodAuthentication");
              }}
            >
              {Tools.i18n.t("skip")}
            </TextButton>
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
    zIndex: 200,
    alignSelf: "center",
    top: -25,
    // borderColor: 'red',
    // borderWidth: 1,
    // transform: [
    //   {scale: 0.38,}
    // ],
  },
  bird: {
    alignSelf: "center",
    flex: 3,
  },
  title: {
    textAlign: "left",
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: height * 0.041,
    // lineHeight: 35.4,
    width: "100%",
  },
  description: {
    fontSize: height * 0.021,
    ...Tools.gStyle.font("400"),
    color: "#404040",
    opacity: 0.71,
    lineHeight: height * 0.032,
    marginVertical: 26,
    height: 130,
  },
  text: {
    flex: 2,
    paddingHorizontal: 20,
    marginBottom: 25,
    fontFamily: "Inter_700Bold",
  },
  skipButton: {
    fontSize: height * 0.018,
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default IntroScreen;
