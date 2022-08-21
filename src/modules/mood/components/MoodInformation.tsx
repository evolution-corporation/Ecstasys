import { useNavigation } from "@react-navigation/native";
import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Text as TextSVG,
} from "react-native-svg";
import i18n from "~i18n";
import { useAppSelector } from "~store";
import { colors } from "~styles";
import ColorButton from "~components/ColorButton";
import IndicatorMood from "~components/IndicatorMood";
import StatusMood from "~components/StatusMood";
import {useMood} from "~modules/mood/hook";

const MoodInformation: FC<Props> = (props) => {
  const { type } = props;
  const navigation = useNavigation();
  const { moodScore, lastMood } = useMood()
  if (type == "minimal") {
    return (
      <ColorButton
        text={lastMood ? i18n.getMood(lastMood, 0) : i18n.t("answer")}
        type={"small"}
        onPress={() => navigation.navigate("SelectMood")}
      />
    );
  } else {
    const [size, setSize] = useState<{
      width: number;
      height: number;
    } | null>();

    return (
      <View style={styles.background}>
        <IndicatorMood style={styles.moodIndicator} />
        <StatusMood style={styles.statusMood} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 21,
    borderRadius: 20,
  },
  moodIndicator: {
    flex: 1,
  },
  statusMood: {
    flex: 3,
  },
});

type Props = { type: "minimal" | "Full" };

export default MoodInformation;
