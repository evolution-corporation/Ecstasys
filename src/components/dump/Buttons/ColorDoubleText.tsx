import React, { FC } from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";

import Tools from "~core";

import ColorBaseButton, { Props as ColorBaseButtonProps } from "./Base";

const ColorButtonDoubleText: FC<Props> = (props) => {
  const { leftText, children, styleLeftText, styleButton, styleText } = props;
  return (
    <ColorBaseButton
      {...props}
      styleButton={StyleSheet.compose(styleButton, {
        justifyContent: "space-between",
        paddingHorizontal: 20,
      })}
      secondItem={
        <Text style={StyleSheet.compose(styleLeftText, styleText)}>
          {leftText}
        </Text>
      }
    >
      {children}
    </ColorBaseButton>
  );
};

export interface Props extends ColorBaseButtonProps {
  leftText: string;
  styleLeftText?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  textButton: {
    color: "#555555",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default ColorButtonDoubleText;
