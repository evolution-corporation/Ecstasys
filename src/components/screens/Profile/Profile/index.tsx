import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";

import { DoubleColorView } from "~components/containers";
import {
  ViewStatisticsMeditation,
  ColorWithIconButton,
} from "~components/dump";
import Tools from "~core";
import { AntDesign } from "@expo/vector-icons";
import { useUserContext } from "~modules/account";
import type { ViewStatisticsMeditationType } from "~components/dump/ViewStatisticsMeditation";

import { UserInformation } from "./components";

import type { ProfileCompositeScreenProps } from "~routes/index";

const Profile: ProfileCompositeScreenProps = ({ navigation }) => {
  const _weekOpacity = useSharedValue(0.6);
  const _monthOpacity = useSharedValue(1);
  const _allOpacity = useSharedValue(0.6);
  const _positionArrow = useSharedValue(4);

  const [typeStatisticsMeditation, setTypeStatisticsMeditation] =
    useState<ViewStatisticsMeditationType>("month");

  const coordinate = useRef<{ week?: number; month?: number; all?: number }>(
    {}
  );

  const aStyle = {
    weekStyle: useAnimatedStyle(() => ({
      opacity: withTiming(_weekOpacity.value),
    })),
    monthStyle: useAnimatedStyle(() => ({
      opacity: withTiming(_monthOpacity.value),
    })),
    allStyle: useAnimatedStyle(() => ({
      opacity: withTiming(_allOpacity.value),
    })),
    position: useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(_positionArrow.value) }],
    })),
  };

  const editTimePeriod = useCallback(
    async (timePeriod: ViewStatisticsMeditationType) => {
      _weekOpacity.value = 0.6;
      _monthOpacity.value = 0.6;
      _allOpacity.value = 0.6;
      switch (timePeriod) {
        case "week":
          _weekOpacity.value = 1;
          if (coordinate.current.week && coordinate.current.month)
            _positionArrow.value =
              coordinate.current.week - coordinate.current.month + 7;
          break;
        case "month":
          _monthOpacity.value = 1;
          _positionArrow.value = 4;
          break;
        case "all":
          _allOpacity.value = 1;
          if (coordinate.current.all && coordinate.current.month)
            _positionArrow.value =
              coordinate.current.all - coordinate.current.month + 3;
          break;
      }
      setTypeStatisticsMeditation(timePeriod);
    },
    []
  );

  const { user } = useUserContext();

  useEffect(() => {
    if (user !== null && user !== undefined) {
      navigation.setOptions({
        title: user.nickName,
      });
    }
  }, [user]);

  return (
    <DoubleColorView
      style={{ flex: 1, paddingHorizontal: 20 }}
      heightViewPart={300}
    >
      <UserInformation />
      <View style={{ marginVertical: 16 }}>
        <View style={styles.selectTimePeriodContainer}>
          <Pressable
            onPress={() => editTimePeriod("week")}
            onLayout={({ nativeEvent: { layout } }) => {
              if (!coordinate.current.week) {
                coordinate.current.week = layout.x;
              }
            }}
          >
            <Animated.Text style={[styles.selectTimePeriod, aStyle.weekStyle]}>
              {Tools.i18n.t("9e9fa745-7048-4a16-b227-7e3393a0e760")}
            </Animated.Text>
          </Pressable>
          <Pressable
            onPress={() => editTimePeriod("month")}
            onLayout={({ nativeEvent: { layout } }) => {
              if (!coordinate.current.month) {
                coordinate.current.month = layout.x;
              }
            }}
          >
            <Animated.Text style={[styles.selectTimePeriod, aStyle.monthStyle]}>
              {Tools.i18n.t("39f791d7-75c7-4c2a-9ea2-cbdd0d4fac17")}
            </Animated.Text>
          </Pressable>
          <Pressable
            onPress={() => editTimePeriod("all")}
            onLayout={({ nativeEvent: { layout } }) => {
              if (!coordinate.current.all) {
                coordinate.current.all = layout.x;
              }
            }}
          >
            <Animated.Text style={[styles.selectTimePeriod, aStyle.allStyle]}>
              {Tools.i18n.t("3bbe4d69-a6c5-4da0-8dad-0a67fd10cc61")}
            </Animated.Text>
          </Pressable>
        </View>
        <Animated.View style={[{ alignSelf: "center" }, aStyle.position]}>
          <Entypo name="chevron-down" size={24} color={"#FFFFFF"} />
        </Animated.View>
      </View>
      <ViewStatisticsMeditation
        type={typeStatisticsMeditation}
        colorR={"#7C3D91"}
        colorL={"#C2A9CE"}
      />
      <ColorWithIconButton
        icon={
          <AntDesign
            name="heart"
            size={24}
            color="#F83047"
            style={{ marginLeft: 15 }}
          />
        }
        styleButton={[styles.button, { marginTop: 18 }]}
        styleText={styles.buttonText}
        onPress={() => {
          navigation.navigate("FavoriteMeditation");
        }}
      >
        {Tools.i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1")}
      </ColorWithIconButton>
      <ColorWithIconButton
        icon={
          <AntDesign
            name="star"
            size={24}
            color="#FBBC05"
            style={{ marginLeft: 15 }}
          />
        }
        styleButton={styles.button}
        styleText={styles.buttonText}
        onPress={() => {
          navigation.navigate("SelectSubscribe");
        }}
      >
        {Tools.i18n.t("b2f016a6-b60e-4b5f-9cd9-ead2bddaa9d5")}
      </ColorWithIconButton>
    </DoubleColorView>
  );
};

const styles = StyleSheet.create({
  selectTimePeriodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectTimePeriod: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 14,
    ...Tools.gStyle.font("500"),
  },
  button: {
    backgroundColor: "#7C3D91",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingLeft: 60,
    marginVertical: 7.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default Profile;
