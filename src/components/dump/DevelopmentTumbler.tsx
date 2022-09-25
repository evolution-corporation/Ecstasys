import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import core, { useApiOFF, useCustomDataUser, useShowIntroScreen } from "~core";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import ColorButton from "./Buttons/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DevelopmentTumblers = () => {
  const [isApiOff, setIsApiOff] = useApiOFF();
  const [isCustomUserData, setIsCustomUserData] = useCustomDataUser();

  const heigthCustomUser = useSharedValue(isApiOff ? 0 : -100);
  const styleCustomUserData = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(heigthCustomUser.value) }],
  }));
  const [isShowCustomUserData, setIsShowCustomUserData] = useState(isApiOff);
  const [showScreenPractices, setShowScreenPractices] = useShowIntroScreen(
    "IsFirstShownPractices"
  );
  const [showScreenMain, setShowScreenMain] =
    useShowIntroScreen("IsFirstShownMain");
  useEffect(() => {
    if (isApiOff) {
      setIsShowCustomUserData(true);
      heigthCustomUser.value = 0;
    } else {
      heigthCustomUser.value = -100;
      setIsShowCustomUserData(false);
    }
  }, [isApiOff]);

  if (__DEV__) {
    return (
      <View>
        <View
          style={[
            styles.button,
            { justifyContent: "space-between", height: "auto" },
          ]}
          key={"isApiOff"}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="api-off" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {core.i18n.t("18948355-b85d-4d34-a972-ee11822a3d67")}
            </Text>
          </View>
          <Switch
            value={isApiOff}
            onValueChange={(value) => setIsApiOff(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </View>
        {isShowCustomUserData ? (
          <Animated.View style={styleCustomUserData} key={"customUserData"}>
            <View style={styles.button}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="user-cog" size={24} color="#FFFF" />
                <Text style={styles.buttonText}>
                  {core.i18n.t("d03faeda-abab-421e-9123-5aa6567d5263")}
                </Text>
              </View>
              <Switch
                value={isCustomUserData}
                onValueChange={(value) => setIsCustomUserData(value)}
                thumbColor={"#FFFFFF"}
                trackColor={{
                  true: "#FBBC05",
                  false: "rgba(0, 0, 0, 0.4)",
                }}
              />
            </View>
            {isCustomUserData ? (
              <ColorButton
                styleButton={styles.colorButoon}
                styleText={styles.colorButtonText}
                onPress={async () => {
                  await AsyncStorage.removeItem("@CustomDataUser");
                  setIsCustomUserData(false);
                }}
              >
                {core.i18n.t("27845d3b-8c0f-4c1a-b621-c20b7f642907")}
              </ColorButton>
            ) : null}
          </Animated.View>
        ) : null}
        <View
          style={[
            styles.button,
            { justifyContent: "space-between", height: "auto" },
          ]}
          key={"isApiOff"}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="human-greeting"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              {core.i18n.t("cfb4eeac-9511-4dc7-a331-ca8024bc5926")}
            </Text>
          </View>
          <Switch
            value={showScreenMain}
            onValueChange={(value) => setShowScreenMain(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="human-greeting"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              {core.i18n.t("ed220977-2875-482c-94f7-8e6fc89bfc47")}
            </Text>
          </View>
          <Switch
            value={showScreenPractices}
            onValueChange={(value) => setShowScreenPractices(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default DevelopmentTumblers;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#9765A8",
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: {
    marginLeft: 34,
    color: "#FFFFFF",
    ...core.gStyle.font("400"),
    fontSize: 15,
  },
  colorButoon: {},
  colorButtonText: {},
});
