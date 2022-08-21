import React, { FC } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ColorButton from "~components/ColorButton";
import BackgroundGradient from "~containers/BackgroundGradient";
import Icon from "~assets/icons";
import i18n from "~i18n";
import style, { colors } from "~styles";

const ScreenFinallyResult: FC<
  NativeStackScreenProps<EditMeditationsParametersList, "ScreenFinallyResult">
> = ({ navigation, route }) => (
  <View style={styles.background}>
    <View style={styles.info}>
      <Icon name={"CheckMarker"} variable={"whiteThin"} />
      <Text style={[styles.title, styles.text]}>{i18n.t("ready")}!</Text>

      <Text style={[styles.title, styles.text]}>
        {i18n.t(
          route.params.result
            ? "4c0dd21c-a7c0-4b0b-85a3-05c13168f22b"
            : "de79f337-c26b-4f6a-b7be-6dfeabddfbeb"
        )}
      </Text>
      <Text style={[styles.subTitle, styles.text]}>
        {i18n.t(
          route.params.result
            ? "7ed7c129-1ff4-41ce-a06f-f71c70674074"
            : "82b229b0-c95d-44be-b9e4-d1deb37cce61"
        )}
      </Text>
    </View>
    <ColorButton
      text={i18n.t("ready")}
      styleButton={styles.buttonReady}
      styleText={styles.buttonTextReady}
      type={"small"}
      onPress={() => {
        navigation.getParent()?.goBack();
      }}
    />
  </View>
);

export default ScreenFinallyResult;

const styles = StyleSheet.create({
  background: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 70,
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  buttonReady: {
    backgroundColor: colors.violet,
    marginTop: 150,
  },
  buttonTextReady: {
    color: colors.white,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    ...style.getFontOption("700"),
    marginVertical: 20,
    width: Dimensions.get("window").width * 0.75,
  },
  subTitle: {
    color: colors.StrokePanel,
    fontSize: 12,
    ...style.getFontOption("500"),
    marginTop: 18,
    width: Dimensions.get("window").width * 0.7,
  },
  text: {
    textAlign: "center",
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
  },
});
