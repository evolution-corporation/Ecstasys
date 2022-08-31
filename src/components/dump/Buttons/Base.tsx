import React, { FC } from "react";
import {
  TouchableOpacity,
  PressableProps,
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
  StyleProp,
} from "react-native";

import Tools from "~core";

const Base: FC<Props> = (props) => {
  const {
    children,
    styleButton,
    secondItem,
    styleText,
    onPress = () => {},
  } = props;
  return (
    <TouchableOpacity
      style={[styles.backgroundButton, styleButton]}
      onPress={() => onPress()}
    >
      {secondItem}
      <Text style={[styles.textButton, styleText]}>{children}</Text>
    </TouchableOpacity>
  );
};

export interface Props extends PressableProps {
  styleButton?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  secondItem?: JSX.Element;
  onPress?: () => void;
  children?: string;
}

const styles = StyleSheet.create({
  backgroundButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textButton: {
    color: "#555555",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default Base;
