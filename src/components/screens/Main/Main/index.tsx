import React, { useEffect, useRef, useState } from "react";

import {
  ImageBackground,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { ViewStatisticsMeditation, UserButton } from "~components/dump";
import account from "~modules/account";
import Tools from "~core";

import { ProfessorMessage, MeditationCard } from "./components";
import { useShowIntro } from "~routes/hook";
import type { MainScreenCompositeScreenProps } from "~routes/index";
import { useMeditationRecomendation, useMeditationToDay } from "./hooks";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useBackHandler } from "@react-native-community/hooks";

var height = Dimensions.get("window").height;

const Main: MainScreenCompositeScreenProps = ({ navigation }) => {
  useShowIntro(
    "@IsFirstShownMain",
    () => navigation.navigate("IntroMainScreen"),
    [navigation.isFocused()]
  );
  const [heightGreeting, setHeightGreeting] = useState<number | null>(null);
  const toDayPopularMeditation = useMeditationToDay();
  const recomendationMeditation = useMeditationRecomendation();

  const translateGreeting = useSharedValue(0);
  const greetingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateGreeting.value }],
  }));

  const feedStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: interpolate(
      translateGreeting.value,
      [20, 100],
      [20, 0]
    ),
    borderTopRightRadius: interpolate(
      translateGreeting.value,
      [20, 100],
      [20, 0]
    ),
  }));

  if (account === undefined) {
    return null;
  }
  // const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      // ref={scrollViewRef}
      onScroll={({ nativeEvent }) => {
        if (!!heightGreeting) {
          let value = 20;
          if (nativeEvent.contentOffset.y <= 20) {
            value = 20;
          } else if (nativeEvent.contentOffset.y < heightGreeting) {
            value = nativeEvent.contentOffset.y * 0.3;
          } else {
            value = heightGreeting;
          }

          translateGreeting.value = value;
        }
      }}
      style={{
        position: "absolute",
        height: Dimensions.get("window").height + 100,
        width: "100%",
        top: -70,
        bottom: -50,
      }}
      showsVerticalScrollIndicator={false}
      stickyHeaderHiddenOnScroll
      contentContainerStyle={{ paddingVertical: 50 }}
      bounces={false}
    >
      <Animated.View
        style={greetingStyle}
        onLayout={({ nativeEvent: { layout } }) => {
          if (!!heightGreeting) setHeightGreeting(layout.height);
        }}
      >
        <ImageBackground
          source={require("./assets/background.png")}
          style={styles.imageGreeting}
        >
          <UserButton style={styles.userButton} />
          <View
            style={styles.greeting}
            onLayout={({ nativeEvent: { layout } }) => {
              if (!heightGreeting) {
                setHeightGreeting(layout.height + 20);
              }
            }}
          >
            <ProfessorMessage />
          </View>
        </ImageBackground>
      </Animated.View>
      <Animated.View style={[styles.feed, feedStyle]}>
        <Text style={styles.title}>
          {Tools.i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}
        </Text>
        <Text style={styles.description}>
          {Tools.i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}
        </Text>
        {recomendationMeditation !== null ? (
          <MeditationCard
            name={recomendationMeditation.name}
            description={recomendationMeditation.description}
            image={recomendationMeditation.image}
            time={recomendationMeditation.lengthAudio}
            isCustomTime={recomendationMeditation.isCustomTime}
            id={recomendationMeditation.id}
          />
        ) : (
          <ActivityIndicator color={"#9765A8"} size={"large"} />
        )}

        <ViewStatisticsMeditation
          style={styles.statisticsMeditation}
          type={"week"}
        />
        <Text style={styles.title}>
          {Tools.i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}
        </Text>
        <Text style={styles.description}>
          {Tools.i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}
        </Text>
        {toDayPopularMeditation !== null ? (
          <MeditationCard
            name={toDayPopularMeditation.name}
            description={toDayPopularMeditation.description}
            image={toDayPopularMeditation.image}
            time={toDayPopularMeditation.lengthAudio}
            isCustomTime={toDayPopularMeditation.isCustomTime}
            id={toDayPopularMeditation.id}
          />
        ) : (
          <ActivityIndicator color={"#9765A8"} size={"large"} />
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  imageGreeting: {
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: 20,
  },
  professor: {
    width: 147,
    height: 147,
    alignSelf: "center",
  },
  userButton: {
    marginLeft: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },

  greeting: {
    paddingTop: 5,
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 40,
  },
  title: {
    color: "#555555",
    fontSize: height * 0.026,
    lineHeight: 23,
    ...Tools.gStyle.font("400"),
    marginBottom: 7,
  },
  description: {
    color: "#A0A0A0",
    fontSize: height * 0.018,
    lineHeight: 16,
    ...Tools.gStyle.font("400"),
    marginBottom: 12,
  },
  statisticsMeditation: {
    marginVertical: 22,
  },
  userProfile: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  feed: {
    backgroundColor: "#FFFFFF",
    minHeight: Dimensions.get("window").height,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export default Main;
