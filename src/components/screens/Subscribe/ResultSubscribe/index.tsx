import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import Tools from "~core";

import Check from "./assets/Check.svg";

const ResultSubscribeScreen = ({ route = { params: { status: "Edit" } } }) => {
  const { params } = route;
  return (
    <View style={styles.background}>
      <Check />
      <Text style={[styles.textTitle, { marginTop: 28 }]}>
        {Tools.i18n.t("ready")}!
      </Text>
      <Text style={[styles.textTitle, { marginTop: 30, marginBottom: 11 }]}>
        {Tools.i18n.t(
          params.status === "Designations"
            ? "36665b8a-3801-4b54-928a-22d9291e279d"
            : params.status === "Edit"
            ? "3c0d4097-a685-4141-9459-fdade7175b3b"
            : "274347f0-628b-4128-8595-d6be9611ea03"
        )}
        !
      </Text>
      <Text style={styles.textDescription}>
        {Tools.i18n.t(
          params.status === "Designations"
            ? "cd6eba3d-0d93-4e46-bb3c-d809ee76b181"
            : params.status === "Edit"
            ? "b952bec5-f5b6-439b-ab66-5e118673c19f"
            : "2b2951bd-0ee8-42c7-b37e-2a7059596b6a"
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#9765A8",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    ...Tools.gStyle.font("700"),
  },
  textDescription: {
    color: "#E7DDEC",
    fontSize: 14,
    lineHeight: 17,
    width: "80%",
    maxWidth: Dimensions.get("screen").width - 40,
    textAlign: "center",
  },
});

export default ResultSubscribeScreen;
