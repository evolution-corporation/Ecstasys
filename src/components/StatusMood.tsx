import React, { FC, useMemo } from "react";
import {
  View,
  ViewProps,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import i18n from "~i18n";
import { useAppSelector } from "~store";
import style, { colors, styleText } from "~styles";
import ColorButton from "./ColorButton";

const StatusMood: FC<Props> = (props) => {
  const { style } = props;
  const score = useAppSelector((state) =>
    state.account.moodScore.length > 0
      ? state.account.moodScore.reduce(
          (previousValue, item) =>
            previousValue + item / state.account.moodScore.length,
          0
        )
      : 0
  );
  const { stateMessage, stateName } = useMemo(() => {
    if (score > 70) {
      return {
        stateMessage: i18n.t("b41ae983-3686-4181-9807-96c5236a940d"),
        stateName: i18n.t("ed20e270-100d-4910-a205-7e8d8081f7ea"),
      };
    }
    if (score > 30) {
      return {
        stateMessage: i18n.t("89875ded-5b1a-426d-870d-f0f330b0ccb8"),
        stateName: i18n.t("7255b757-4f8e-4c66-b179-96e7e893e772"),
      };
    }
    if (score > 10) {
      return {
        stateMessage: i18n.t("d16f71bd-8f3b-4041-9141-68d09f4aab42"),
        stateName: i18n.t("5620317c-98e6-4ba9-bce0-dbf892fc1b37"),
      };
    }
    return {
      stateMessage: 'i18n.t("d16f71bd-8f3b-4041-9141-68d09f4aab42")',
      stateName: 'i18n.t("5620317c-98e6-4ba9-bce0-dbf892fc1b37")',
    };
  }, [score]);

  return (
    <View style={[styles.background, style]}>
      <Text style={styles.title}>{i18n.t("state")}</Text>
      <Text style={styles.message} adjustsFontSizeToFit={true}>
        {score == 0
          ? i18n.t("c858076b-811b-49ae-b9cd-a8661ba92097")
          : stateMessage}
      </Text>
      {score == 0 ? (
        <ColorButton
          type="small"
          text={i18n.t("f6c1419f-21b3-4492-8eb6-36b549cd882d")}
          styleButton={styles.button}
          styleText={styles.buttonText}
        />
      ) : (
        <Text style={[styles.buttonText, styles.button, styles.textFix]}>
          {stateName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...styleText.h1,
    color: colors.violet,
    textAlign: "left",
    marginBottom: 5,
  },
  message: {
    ...styleText.helpMessage,
    color: colors.violet,
    textAlign: "left",
  },
  buttonText: {
    color: colors.violet,
    fontSize: 13,
    ...style.getFontOption("500"),
  },
  button: {
    marginTop: 9,
    backgroundColor: colors.TextOnTheBackground,
    borderRadius: 20.5,
    height: 34,
  },
  textFix: {
    textAlign: "left",
    textAlignVertical: "center",
    paddingHorizontal: 11,
  },
  background: {
    alignItems: "flex-start",
  },
});

interface Props extends ViewProps {}

export default StatusMood;
