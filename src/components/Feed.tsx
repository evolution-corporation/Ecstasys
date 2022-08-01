import { useNavigation } from "@react-navigation/native";
import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Icon from "~assets/icons";
import FeedCard from "~containers/FeedCard";
import useIsServerAccess from "~hooks/useIsServerAccess";
import i18n from "~i18n";
import { useAppSelector } from "~store";
import style, { colors } from "~styles";
import ColorButton, { TextButton } from "./ColorButton";
import MeditationCard from "./MeditationCard";
import ProfessorMessage from "./ProfessorMessage";
import StatisticMeditation from "./StatisticMeditation";

const Feed: FC<Props> = (props) => {
  const { enable = true } = props;
  const isServerAccess = useIsServerAccess();

  const refScrollVew = React.useRef<React.ElementRef<typeof ScrollView>>(null);
  const meditationList = useAppSelector((state) => ({
    meditationRecommend: state.meditation.meditationRecommendToDay,
    meditationPopularToDay: state.meditation.meditationPopularToDay,
  }));
  const isHavePlanMeditation = useAppSelector(
    (state) => !!state.meditation.parametersMeditation
  );
  const navigation = useNavigation();
  // navigation.navigate("MeditationListener", {
  // 	meditationID: meditationList.meditationPopularToDay.id,
  // });
  return (
    <ScrollView
      ref={refScrollVew}
      style={styles.MeditationListInfo}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={enable}
    >
      {!isServerAccess ? null : (
        <FeedCard
          title={i18n.t(
            isHavePlanMeditation
              ? "7eb34e06-117e-4ccc-a92b-549dfed5f877"
              : "9d0cd47a-0392-4e5c-9573-00642b12f868"
          )}
          subTitle={i18n.t(
            isHavePlanMeditation
              ? "a90954d8-a9fa-4f31-bc63-0004bbb2a9a3"
              : "f292b17c-2295-471e-80cf-f99f6a618701"
          )}
          key={"MeditationList"}
        >
          {meditationList.meditationRecommend ? (
            <MeditationCard
              meditation={meditationList.meditationRecommend}
              type={"full"}
            />
          ) : isHavePlanMeditation ? (
            <ProfessorMessage
              text={i18n.t("cf08c329-9377-4500-be35-d82be69834ad")}
              style={styles.professorMessage}
            />
          ) : (
            <ActivityIndicator />
          )}
          {isHavePlanMeditation ? (
            <TextButton
              text={i18n.t("7363f93d-4efc-4a70-b68c-8cb36f28e458")}
              styleText={styles.textButtonEditPlan}
              onPress={() => navigation.navigate("EditMeditationsParameters")}
            />
          ) : (
            <ColorButton
              type={"small"}
              text={i18n.t("258d5ee4-d6e5-40ad-854a-236226f909be")}
              styleButton={styles.buttonSelectMeditation}
              styleText={styles.buttonSelectMeditationText}
              onPress={() => navigation.navigate("EditMeditationsParameters")}
            />
          )}
        </FeedCard>
      )}
      <FeedCard
        title={i18n.t("714f47ef-f1fc-426b-8fc6-3789b81051f0")}
        subTitle={i18n.t("be0d3e18-6c18-4879-89b1-dca3c0f18194")}
        key={"statistic"}
      >
        <StatisticMeditation type={"small"} />
      </FeedCard>
      {!isServerAccess ? null : (
        <FeedCard
          title={i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf")}
          subTitle={i18n.t("02d07c6c-dc56-4a58-93f0-c4d3acce43b7")}
          key={"popularDay"}
        >
          {meditationList.meditationPopularToDay ? (
            <MeditationCard
              meditation={meditationList.meditationPopularToDay}
            />
          ) : (
            <ActivityIndicator />
          )}
        </FeedCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  professorMessage: {
    color: colors.DarkLetters,
    fontSize: 20,
    ...style.getFontOption("400"),
    marginBottom: 12,
    textAlign: "center",
  },
  meditationListInfoMain: {
    height: Dimensions.get("screen").height,
    width: "100%",
    backgroundColor: colors.white,
  },

  MeditationListInfo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonSelectMeditation: {
    backgroundColor: colors.violet,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonSelectMeditationText: {
    color: colors.white,
  },
  textButtonEditPlan: {
    color: colors.violet,
    fontSize: 13,
    ...style.getFontOption("400"),
    textAlign: "center",
  },
  infoCard: {
    marginBottom: 34,
  },
  closeButton: {
    backgroundColor: colors.DarkGlass,
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: 15,
    position: "absolute",
    top: 20,
    right: 15,
    zIndex: 10,
  },
});

interface Props {
  enable?: boolean;
}

export default Feed;
