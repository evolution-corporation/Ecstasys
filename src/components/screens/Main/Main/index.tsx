import React, { useEffect } from "react";

import {
  ImageBackground,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useBackHandler } from "@react-native-community/hooks";
import { useHeaderHeight } from "@react-navigation/elements";

import { ViewStatisticsMeditation, UserButton } from "~components/dump";
import account from "~modules/account";
import Tools from "~core";

import { ProfessorMessage, Feed, MeditationCard } from "./components";
import { useShowIntro } from "~routes/hook";
import type { MainScreenCompositeScreenProps } from "~routes/index";
import { useMeditationRecomendation, useMeditationToDay } from "./hooks";

const Main: MainScreenCompositeScreenProps = ({ navigation }) => {
  useShowIntro(
    "@IsFirstShownMain",
    () => navigation.navigate("IntroMainScreen"),
    [navigation.isFocused()]
  );
  const [isOpenMeditationListInfo, setIsOpenMeditationListInfo] =
    React.useState<boolean>(false);
  const [heightGreeting, setHeightGreeting] = React.useState<
    number | undefined
  >(undefined);
  const toDayPopularMeditation = useMeditationToDay();
  const recomendationMeditation = useMeditationRecomendation();
  const heightHeade = useHeaderHeight();

  useBackHandler(() => {
    if (isOpenMeditationListInfo) {
      return true;
    } else {
      return false;
    }
  });

  if (account === undefined) {
    return null;
  }

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={[styles.background, { paddingTop: heightHeade }]}
    >
      <UserButton style={styles.userButton} />
      <View
        style={styles.greeting}
        onLayout={({ nativeEvent: { layout } }) => {
          if (!heightGreeting) {
            setHeightGreeting(layout.height);
          }
        }}
      >
        <ProfessorMessage />
      </View>
      <Feed hiddenHeight={heightGreeting}>
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
      </Feed>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  background: {
    flex: 1,
    justifyContent: "flex-start",
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
    paddingTop: 20,
    justifyContent: "flex-start",
    width: "100%",
    minHeight: Dimensions.get("window").height / 2,
  },
  title: {
    color: "#555555",
    fontSize: 20,
    lineHeight: 23,
    ...Tools.gStyle.font("400"),
    marginBottom: 7,
  },
  description: {
    color: "#A0A0A0",
    fontSize: 14,
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
});

export default Main;
