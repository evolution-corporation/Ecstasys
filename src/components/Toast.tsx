import React, {
  FC,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import style, { colors } from "~styles";

const Toast = forwardRef<Ref, Props>((props, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(0)).current;
  const show = () => {
    setIsVisible(true);
    Animated.timing(animation, { toValue: 1, useNativeDriver: true }).start();
    setTimeout(hide, 5 * 1000);
  };
  const hide = () => {
    Animated.timing(animation, { toValue: 0, useNativeDriver: true }).start(
      () => setIsVisible(false)
    );
  };
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (isVisible) {
    return (
      <Animated.View
        style={[
          styles.background,
          props.styleBackground,
          { opacity: animation },
        ]}
      >
        <Text style={[styles.text, props.styleText]}>{props.text}</Text>
      </Animated.View>
    );
  }
  return null;
});

interface Props {
  text: string;
  styleBackground?: ViewStyle;
  styleText?: TextStyle;
}

interface Ref {
  show: () => void;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    borderRadius: 15,
    shadowColor: colors.DarkGlass,
    height: 40,
    paddingHorizontal: 12,
    ...style.getShadows(1, 3),
    zIndex: 1000,
  },
  text: {
    color: colors.gray,
    fontSize: 12,
    ...style.getFontOption("400"),
  },
});
export default Toast;
