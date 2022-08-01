import React, { useEffect, useRef, useState } from "react";
import {
  ColorValue,
  Dimensions,
  View,
  Text,
  StyleSheet,
  ViewProps,
  Animated,
  Easing,
} from "react-native";
import Icon, { IconName } from "~assets/icons";
import i18n from "~i18n";
import { useAppSelector } from "~store";
import style, { colors } from "~styles";
import { TextButton } from "./ColorButton";

const translate = {
  week: "9e9fa745-7048-4a16-b227-7e3393a0e760",
  month: "39f791d7-75c7-4c2a-9ea2-cbdd0d4fac17",
  all: "3bbe4d69-a6c5-4da0-8dad-0a67fd10cc61",
};

const StatisticMeditation: React.FC<Props> = (props) => {
  const { type } = props;
  const [timePeriodName, setTimePeriodName] = useState<
    "week" | "month" | "all"
  >("month");
  const staticMeditation = useAppSelector(
    (state) => state.meditation.statisticMeditation[timePeriodName]
  );
  const points = useRef<{
    week: number;
    month: number;
    all: number;
  }>({ week: 0, month: 0, all: 0 });
  const dPosition = useRef<Animated.Value>(new Animated.Value(0)).current;
  let Wrapper = React.Fragment;
  const [globalSize, setGlobalSize] = useState<SizeComponent | null>();
  useEffect(() => {
    Animated.timing(dPosition, {
      toValue: points.current[timePeriodName],
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
    return () => {};
  }, [timePeriodName]);
  if (type == "full") {
    Wrapper = ({ children }) => (
      <View
        style={styles.background}
        onLayout={({ nativeEvent: { layout } }) => {
          if (!globalSize) {
            setGlobalSize({
              height: layout.height,
              width: layout.width,
            });
          }
        }}
      >
        <View style={styles.selectTimePeriod}>
          {["week", "month", "all"].map((item) => (
            <TextButton
              key={item}
              text={i18n.t(translate[item])}
              styleText={[
                styles.dateName,
                timePeriodName == item ? styles.timePeriodSelected : {},
              ]}
              onPress={() => {
                setTimePeriodName(item);
              }}
              onLayout={({ nativeEvent: { layout } }) => {
                if (globalSize) {
                  points.current[item] =
                    layout.width / 2 + layout.x - globalSize.width / 2;
                }
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: "column", marginVertical: 9 }}>
          <Animated.View
            style={{
              transform: [{ translateX: dPosition }, { translateX: -1 }],
            }}
          >
            <Icon
              name={"TheArrow"}
              variable={"whiteTop"}
              style={[styles.row]}
            />
          </Animated.View>
        </View>
        {children}
      </View>
    );
  }
  return (
    <Wrapper>
      <View style={{ flexDirection: "row", marginHorizontal: -7.5 }}>
        <StaticCard
          icon={"Headphones"}
          backgroundColor={colors.white}
          data={staticMeditation.count}
          text={i18n.t("8f6752b0-6ada-4344-a0b9-dd471eee1297")}
          textColor={colors.StrokePanel}
        />
        <StaticCard
          icon={"Timer"}
          backgroundColor={colors.StrokePanel}
          data={Math.floor(staticMeditation.time / 60)}
          text={i18n.t("10ced895-7fa8-40cb-bc8a-b8880b6086b0")}
          textColor={colors.white}
        />
      </View>
    </Wrapper>
  );
};

const StaticCard: React.FC<{
  icon: IconName;
  text: string;
  data: number;
  backgroundColor: ColorValue;
  textColor: ColorValue;
}> = (props) => (
  <View
    style={[
      styles.staticCardBackground,
      { backgroundColor: props.backgroundColor },
    ]}
  >
    <View style={{ flex: 1, alignItems: "center" }}>
      <Icon name={props.icon} style={styles.icon} />
      <Text style={[styles.staticCardText, { color: props.textColor }]}>
        {props.text}
      </Text>
    </View>
    <Text style={[styles.staticCardData, { color: props.textColor }]}>
      {props.data}
    </Text>
  </View>
);

interface Props extends ViewProps {
  type: "small" | "full";
}

const styles = StyleSheet.create({
  icon: {
    width: 35,
    height: 35,
  },
  staticCardBackground: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    borderColor: colors.StrokePanel,
    borderWidth: 3,
    flex: 1,
    marginHorizontal: 7.5,
  },
  staticCardText: {
    fontSize: 12,
    ...style.getFontOption("400"),
  },
  staticCardData: {
    fontSize: 32,
    ...style.getFontOption("700"),
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  selectTimePeriod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 45,
  },
  dateName: {
    fontSize: 12,
    color: colors.WhiteBrightGlass,
    ...style.getFontOption("500"),
  },
  timePeriodSelected: {
    color: colors.white,
    fontSize: 14,
  },
  background: {
    width: "100%",
  },
  row: {
    transform: [{ rotateZ: "180deg" }, { scale: 1.7 }],
    alignSelf: "center",
  },
});

export default StatisticMeditation;
