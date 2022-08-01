import React, { FC } from "react";
import {
  View,
  Text,
  ViewProps,
  Image,
  StyleSheet,
  TextStyle,
} from "react-native";

const ProfessorMessage: FC<Props> = (props) => {
  const { text, textStyle, style } = props;
  return (
    <View {...props} style={[styles.background, style]}>
      <Image
        source={require("~assets/Professor.png")}
        style={styles.professor}
      />
      <Text style={[styles.greeting, textStyle]}>{text}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  professor: {
    width: 147,
    height: 147,
    alignSelf: "center",
  },
  greeting: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

interface Props extends ViewProps {
  text: string;
  textStyle?: TextStyle;
}

export default ProfessorMessage;
