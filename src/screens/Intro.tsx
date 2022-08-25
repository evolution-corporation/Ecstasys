import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import gStyle, { colors } from "~styles";
import IntroContainer from "~containers/IntroContainer";
import AnimatedButton from "~components/CustomButton/AnimatedButton";
import CarouselIntro from "~components/Carousel/Intro";

import i18n from "~i18n";
import { TextButton } from "~components/ColorButton";
import { MaterialIcons } from "@expo/vector-icons";

const IntroScreen = ({ navigation }) => {
  const [isGreetingPart, setIsGreetingPart] = useState<boolean>(true);
  const refBackground = useRef(null);
  const refContent = useRef(null);
  const buttonColor = useSharedValue(colors.violet);
  useAnimatedStyle;
  const nextButtonColor = useAnimatedStyle(() => ({
    backgroundColor: withTiming(buttonColor.value),
  }));

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!isGreetingPart) {
      refBackground.current?.next();
      refContent.current?.next();
    } else {
      refBackground.current?.prev();
      refContent.current?.prev();
    }
    buttonColor.value = !isGreetingPart ? colors.white : colors.violet;
  }, [isGreetingPart]);

  const editContent = (next: boolean = true) => {
    if (isGreetingPart && next) {
      setIsGreetingPart(false);
    } else if (!isGreetingPart && !next) {
      setIsGreetingPart(true);
    } else if (!isGreetingPart && next) {
      navigation.navigate("SelectMethodAuthentication");
    }
  };
  return (
    <IntroContainer ref={refBackground}>
      <Image
        source={require("~assets/blackProfessor.png")}
        style={[
          styles.professor,
          { width: width / 2, height: (width / 2) * 2.27 },
        ]}
        resizeMethod={"scale"}
        resizeMode={"center"}
      />
      <CarouselIntro ref={refContent} />
      <View style={styles.bottomMenu}>
        {isGreetingPart ? (
          <TextButton
            text={i18n.t("skip")}
            onPress={() => navigation.navigate("SelectMethodAuthentication")}
            styleText={styles.skipButton}
          />
        ) : (
          <AnimatedButton
            animatedStyle={styles.nextButtonContatiner}
            onPress={() => editContent(false)}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={30}
              color={colors.white}
            />
          </AnimatedButton>
        )}
        <AnimatedButton
          style={styles.nextButton}
          animatedStyle={[styles.nextButtonContatiner, nextButtonColor]}
          onPress={() => editContent(true)}
        >
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color={isGreetingPart ? colors.white : colors.violet}
          />
        </AnimatedButton>
      </View>
    </IntroContainer>
  );
};

const styles = StyleSheet.create({
  titleDescription: {
    color: colors.white,
    fontSize: 32,
    ...gStyle.getFontOption("700"),
  },
  description: {
    ...gStyle.getFontOption("400"),
    fontSize: 16,
  },
  professor: {
    alignSelf: "center",
    marginTop: 20,
  },
  skipButton: {
    ...gStyle.getFontOption("400"),
    color: colors.StrokePanel,
    fontSize: 14,
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  nextButtonContatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IntroScreen;
