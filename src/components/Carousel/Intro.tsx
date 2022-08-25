import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import NameApplication from "~components/Text/NameApplication";
import gStyle, { colors } from "~styles";
import i18n from "~i18n";

const CarouselIntro = forwardRef((props, ref) => {
  const { width } = useWindowDimensions();
  const tranlateXBox = useSharedValue(0);
  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(tranlateXBox.value) }],
  }));
  useImperativeHandle(ref, () => ({
    next: () => {
      tranlateXBox.value = -width;
    },
    prev: () => {
      tranlateXBox.value = 0;
    },
  }));

  return (
    <Animated.View style={[styles.background, backgroundStyle]}>
      <View key={"first"} style={[styles.view, { width }]}>
        <NameApplication
          gradient={["#9765A8", "#9195D8"]}
          colorText={colors.carbon}
          customName={"DMD Meditation!"}
        />
        <Text style={[styles.description, { color: colors.moreGray }]}>
          {i18n.t("74547c57-8c9a-48d5-afd0-de9521e37c29")}
        </Text>
      </View>
      <View key={"second"} style={[styles.view, { width }]}>
        <Text style={styles.titleDescription}>
          {i18n.t("4175a7b2-df02-4842-afe5-6146715a6db0")}
        </Text>
        <Text style={[styles.description, { color: colors.StrokePanel }]}>
          {i18n.t("d2959f34-68cc-43a2-b1f0-ffb8d429b418")}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  background: {
    marginHorizontal: -20,
    flexDirection: "row",
  },
  titleDescription: {
    color: colors.white,
    fontSize: 32,
    ...gStyle.getFontOption("700"),
  },
  description: {
    ...gStyle.getFontOption("400"),
    fontSize: 16,
  },
  view: {},
});

export default CarouselIntro;
