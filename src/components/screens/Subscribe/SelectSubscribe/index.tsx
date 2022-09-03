import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { DoubleColorView } from "~components/containers";
import Tools from "~core";

import Bird from "./assets/bird";

const SelectSubscribeScreen = () => {
  return (
    <DoubleColorView heightViewPart={229} style={styles.background}>
      <AntDesign name="star" size={24} color={"#FBBC05"} />
      <Text style={styles.TitlePremium}>Premium</Text>

      <View style={[styles.subscribeCard, { backgroundColor: "#FFFFFF" }]}>
        <View style={styles.textPrice}>
          <Text style={styles.month}>
            {Tools.i18n.t("d4778887-6b9d-44fc-a20e-c042f82ef115", { count: 1 })}
          </Text>
          <Text style={[styles.priceSubs, { color: "#702D87" }]}>
            <Text style={styles.price}>
              {Tools.i18n.t("1d05ec08-f140-4774-b71b-7e1ce078cd94")}
            </Text>
            {"\n"}
            {Tools.i18n.t("4415fe5e-bd86-41b1-91ca-5b20c685172b")}
          </Text>
        </View>
        <View style={styles.imageCard}>
          <Bird color={"#702D87"} />
          <Image source={require("./assets/pillow.png")} />
        </View>
      </View>
    </DoubleColorView>
  );
};

export default SelectSubscribeScreen;

const styles = StyleSheet.create({
  TitlePremium: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("600"),
  },
  priceSubs: {
    fontSize: 14,
    ...Tools.gStyle.font("400"),
    width: 160,
    lineHeight: 16,
  },
  price: {
    ...Tools.gStyle.font("600"),
  },
  subscribeCard: {
    width: "100%",
    height: 150,
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
  },
  background: {
    paddingHorizontal: 20,
  },
  month: {
    fontSize: 20,
    ...Tools.gStyle.font("600"),
  },
  textPrice: {
    justifyContent: "space-between",
  },
  imageCard: {
    alignItems: "flex-end",
  },
});
