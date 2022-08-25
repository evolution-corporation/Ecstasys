import React, { FC, useState } from "react";
import { TextProps, Text, StyleSheet, ColorValue } from "react-native";
import gStyles, { colors } from "~styles";
import i18n from "~i18n";
import GradientText from "./GradientText";

const NameApplication: FC<Props> = (props) => {
  const {
    width = "100%",
    gradient,
    colorText = colors.white,
    customName = "dmd meditation",
  } = props;
  const [widthComponent, setWidthComponent] = useState<number | null>(null);

  return (
    <>
      <Text
        style={[styles.title, { width, color: colorText }]}
        adjustsFontSizeToFit={true}
        onLayout={({ nativeEvent: { layout } }) => {
          if (widthComponent == null) {
            setWidthComponent(layout.width);
          }
        }}
      >
        {i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}

        {gradient ? (
          <GradientText
            colors={gradient}
            style={[styles.gradientText, styles.nameApp]}
          >
            {`\n${customName}`}
          </GradientText>
        ) : (
          <Text style={styles.nameApp}>{`\n${customName}`}</Text>
        )}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  gradientText: {},
  nameApp: {
    fontFamily: "Glory",
    fontWeight: "700",
    fontSize: 32,
    transform: [{ translateY: -35 }],
  },
  title: {
    fontSize: 32,
    color: colors.white,
    ...gStyles.getFontOption("bold"),
  },
});

interface Props extends TextProps {
  width?: number | string;
  colorText?: ColorValue;
  gradient?: string[];
  customName?: string;
}

export default NameApplication;
