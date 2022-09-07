import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { DoubleColorView } from "~components/containers";
import { ColorButton } from "~components/dump";
import Tools from "~core";

import { typeSubscribe } from "./types";
import Bird from "./assets/bird";
import { CircleCheck, SubscribeCard } from "./components";

const price = {
  month_1: 279,
  month_6: 1179,
};

const SelectSubscribeScreen = () => {
  const [subscribeInformation, setSubscribeInformation] = useState<{
    autoPayment: boolean;
    lastDatePayment?: Date;
    type: typeSubscribe;
  }>({
    autoPayment: false,
    lastDatePayment: new Date(2022, 9, 1),
    type: null,
  });
  const [selectedSubscribe, setSelectedSubscribe] =
    useState<typeSubscribe>(null);
  const _transpareteYButton = useSharedValue(300);
  const aStyle = {
    button: useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withSpring(_transpareteYButton.value),
        },
      ],
    })),
  };

  useEffect(() => {
    if (selectedSubscribe !== null) {
      _transpareteYButton.value = 0;
    }
  }, [selectedSubscribe]);

  const isActiveSubs =
    (subscribeInformation.lastDatePayment &&
      subscribeInformation.lastDatePayment.getTime() >= Date.now()) ??
    false;

  return (
    <DoubleColorView heightViewPart={229} style={styles.background}>
      <View style={{ alignItems: "center" }}>
        {isActiveSubs && (
          <Text style={styles.isHaveSubscribe}>
            {Tools.i18n.t("a14d438c-e101-4e6b-9757-74d7f388c97b")}
          </Text>
        )}
        <AntDesign name="star" size={24} color={"#FBBC05"} />
        <Text style={styles.TitlePremium}>Premium</Text>
        <Text style={styles.currentMeditationInfo}>
          {subscribeInformation.lastDatePayment &&
          subscribeInformation.lastDatePayment.getTime() >= Date.now()
            ? Tools.i18n.t(
                subscribeInformation.autoPayment
                  ? "392fd6e3-9b0c-4673-b1c2-45deeaadd7b1"
                  : "048d71cd-03e2-4c8f-9f29-d2e5e9576a07",
                {
                  datemtime: `${subscribeInformation.lastDatePayment.getDate()}.${
                    subscribeInformation.lastDatePayment.getMonth() + 1
                  }.${subscribeInformation.lastDatePayment.getFullYear()}`,
                }
              )
            : Tools.i18n.t("636763b2-80fc-4bd3-84ac-63c21cd34d77")}
        </Text>
        <SubscribeCard
          image={require("./assets/pillow.png")}
          isSelected={selectedSubscribe === "1 month"}
          isUsed={isActiveSubs && subscribeInformation.type === "1 month"}
          onPress={() => setSelectedSubscribe("1 month")}
          price={price.month_1}
          stylesContent={{
            textStyle: { color: "#702D87" },
            background: { backgroundColor: "#F3F3F3" },
          }}
          mainColor={"#702D87"}
          countMonth={1}
          textPrice={{
            top: Tools.i18n.t("1d05ec08-f140-4774-b71b-7e1ce078cd94", {
              price: price.month_1,
            }),
            bottom: Tools.i18n.t("4415fe5e-bd86-41b1-91ca-5b20c685172b"),
          }}
          onCancelSubscribe={() => {}}
          isShowCancelButton={subscribeInformation.autoPayment}
        />
        {isActiveSubs && subscribeInformation.type === "1 month" && (
          <Text style={styles.offerToChangeSubscribeType}>
            {Tools.i18n.t("b6f80560-6ba6-4646-821a-a03ca72acb74")}
          </Text>
        )}
        <SubscribeCard
          image={require("./assets/armchair.png")}
          isSelected={selectedSubscribe === "6 month"}
          isUsed={isActiveSubs && subscribeInformation.type === "6 month"}
          onPress={() => setSelectedSubscribe("6 month")}
          price={price.month_6}
          stylesContent={{
            textStyle: { color: "#FFFFFF" },
            background: { backgroundColor: "#702D87" },
          }}
          mainColor={"#FFFFFF"}
          countMonth={6}
          secondElement={
            <Text style={styles.benefitPrice}>
              {Tools.i18n.t("5b805945-9f3f-41df-a6c5-3d7d9747a118", {
                percent: Math.ceil(
                  100 - (price.month_6 / (price.month_1 * 6)) * 100
                ),
              })}
            </Text>
          }
          textPrice={{
            top: Tools.i18n.t("56b57ad2-f5f3-4f05-9f43-55d2edb25bdf", {
              price: price.month_6,
            }),
            bottom: Tools.i18n.t("84fe380b-74a9-4d02-9463-550c2d746617"),
          }}
          onCancelSubscribe={() => {}}
          // TODO: Navigation
          isShowCancelButton={subscribeInformation.autoPayment}
        />
      </View>
      <ColorButton
        styleButton={styles.button}
        styleText={styles.buttonText}
        animationStyle={aStyle.button}
        // TODO: Navigation
      >
        {Tools.i18n.t("Arrange")}
      </ColorButton>
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
    marginVertical: 9,
  },
  background: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  month: {
    fontSize: 20,
    ...Tools.gStyle.font("600"),
  },
  textPrice: {
    justifyContent: "space-between",
  },
  imageCard: {
    flexDirection: "row",
  },
  imagePeople: {
    position: "absolute",
    alignSelf: "center",
    right: 38,
  },
  currentMeditationInfo: {
    color: "#E7DDEC",
    textAlign: "center",
    fontSize: 16,
    ...Tools.gStyle.font("400"),
    width: "80%",
  },
  checkSelectedSubscribe: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  isHaveSubscribe: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("600"),
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#9765A8",
  },
  buttonText: {
    color: "#FFFFFF",
  },
  offerToChangeSubscribeType: {
    color: "#3D3D3D",
    fontSize: 16,
    ...Tools.gStyle.font("600"),
    textAlign: "center",
  },
  benefitPriceView: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 27,
    paddingVertical: 7,
    borderRadius: 15,
  },
  benefitPrice: {
    color: "#FBBC05",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 27,
    paddingVertical: 7,
    borderRadius: 15,
    fontSize: 13,
    ...Tools.gStyle.font("600"),
    marginTop: 12,
  },
});
