import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

interface GradientTextProps {
  colors: string[];
  [x: string]: any;
}

const GradientText = ({ colors, ...rest }: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...rest} />} style={styles.background}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          {...rest}
          style={[rest.style, styles.text]}
          adjustsFontSizeToFit={true}
        />
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  text: { opacity: 0 },
});

export default GradientText;
