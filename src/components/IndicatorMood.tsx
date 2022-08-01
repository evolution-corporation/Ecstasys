import React, { FC, useMemo, useState } from "react";
import { View, Text, ViewProps, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";
import { useAppSelector } from "~store";
import style, { colors } from "~styles";

const IndicatorMood: FC<Props> = (props) => {
  const [size, setSize] = useState<number | null>(null);
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
  const deg: number = score < 100 ? Math.floor((360 * score) / 100) : 360;
  const { d, rd } = useMemo(() => {
    if (size != null) {
      const radius = (size - 15) / 2;
      const path = [`M0 ${radius}`];
      for (let i = 0; i <= deg; i += 5) {
        path.push(
          `L${radius * Math.sin((i * Math.PI) / 180)} ${
            radius * Math.cos((i * Math.PI) / 180)
          }`
        );
      }
      const lastPath = [`M${path[path.length - 1].slice(1)}`];
      for (let i = deg; i <= 360; i += 5) {
        lastPath.push(
          `L${radius * Math.sin((i * Math.PI) / 180)} ${
            radius * Math.cos((i * Math.PI) / 180)
          }`
        );
      }
      return { d: path, rd: lastPath };
    }
    return { d: [], rd: [] };
  }, [size, score]);

  return (
    <View
      onLayout={({ nativeEvent: { layout } }) => {
        if (size == null) setSize(layout.height);
      }}
      style={[style, styles.background]}
    >
      <View
        style={[
          styles.backgroundSub,
          size ? { width: size, height: size } : {},
        ]}
      >
        {size != null && (
          <Svg height={size} width={size} style={styles.indicator}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#9765A8" stopOpacity="1" />
                <Stop offset="1" stopColor="#9195D8" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Path
              stroke={colors.TextOnTheBackground}
              x={size / 2}
              y={size / 2}
              d={rd.join(" ")}
              strokeWidth={9}
              strokeLinejoin={"round"}
              strokeLinecap={"round"}
              rotation={180}
            />
            {score > 0 && (
              <Path
                stroke="url(#grad)"
                x={size / 2}
                y={size / 2}
                d={d.join(" ")}
                strokeWidth={9}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
                rotation={180}
              />
            )}
          </Svg>
        )}
        <Text style={styles.scoreText} adjustsFontSizeToFit={true}>
          {score == 0 ? "?" : Math.round(score)}
        </Text>
      </View>
    </View>
  );
};

interface Props extends ViewProps {}

const styles = StyleSheet.create({
  background: {
    minHeight: 85,
    minWidth: 85,
  },
  backgroundSub: {
    justifyContent: "center",

    alignItems: "center",
  },
  scoreText: {
    color: colors.violet,
    fontSize: 36,
    ...style.getFontOption("700"),
    textAlign: "center",
    textAlignVertical: "center",
    margin: 17,
  },
  indicator: {
    position: "absolute",
  },
});

export default IndicatorMood;
