import React, { FC } from "react";
import { View, StyleSheet } from "react-native";

import Tools from "~core";

import ColorBaseButton, { Props as ColorBaseButtonProps } from "./Base";

const ColorButtonWithIcon: FC<Props> = (props) => {
  const { icon, children } = props;
  return (
    <ColorBaseButton
      {...props}
      secondItem={
        <View
          style={{
            position: "absolute",
            left: 5,
            alignSelf: "center",
          }}
        >
          {icon}
        </View>
      }
    >
      {children}
    </ColorBaseButton>
  );
};

export interface Props extends ColorBaseButtonProps {
  icon: JSX.Element;
}

const styles = StyleSheet.create({
  textButton: {
    color: "#555555",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default ColorButtonWithIcon;
