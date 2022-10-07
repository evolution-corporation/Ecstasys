import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

import core from "~core";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { ColorButton } from "~components/dump";
import { useSubscribe } from "~modules/subscribe";
// import { typeSubscribe } from "~modules/subscribe/types";

const DevelopmentTumblers = () => {
  // const [isApiOff, setIsApiOff] = useApiOFF();
  // const [isCustomUserData, setIsCustomUserData] = useCustomDataUser();

  // const heigthCustomUser = useSharedValue(isApiOff ? 0 : -100);
  // const styleCustomUserData = useAnimatedStyle(() => ({
  //   transform: [{ translateY: withTiming(heigthCustomUser.value) }],
  // }));
  // const [isShowCustomUserData, setIsShowCustomUserData] = useState(isApiOff);

  // const [showScreenPractices, setShowScreenPractices] = useShowIntroScreen(
  //   "IsFirstShownPractices"
  // );
  // const [showScreenMain, setShowScreenMain] =
  //   useShowIntroScreen("IsFirstShownMain");
  const subscribeInformation = useSubscribe();

  // const [subscribeType, setSubscribeType] = useState<typeSubscribe>("1 month");
  const [autoPayment, setAutoPayment] = useState<boolean>(false);
  // useEffect(() => {
  //   if (isApiOff) {
  //     setIsShowCustomUserData(true);
  //     heigthCustomUser.value = 0;
  //   } else {
  //     heigthCustomUser.value = -100;
  //     setIsShowCustomUserData(false);
  //   }
  // }, [isApiOff]);

  if (__DEV__) {
    return (
      <View style={styles.background}>
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
            // value={isApiOff}
            // onValueChange={(value) => setIsApiOff(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </View>
        {/* {isShowCustomUserData ? (
          <Animated.View style={styleCustomUserData} key={"customUserData"}>
            <View style={styles.button}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="user-cog" size={24} color="#FFFF" />
                <Text style={styles.buttonText}>
                  {core.i18n.t("d03faeda-abab-421e-9123-5aa6567d5263")}
                </Text>
              </View>
              <Switch
                // value={isCustomUserData}
                // onValueChange={(value) => setIsCustomUserData(value)}
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
      */}
        <View
          style={[
            styles.button,
            { justifyContent: "space-between", height: "auto" },
          ]}
          key={"showGreetingMain"}
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
            // value={showScreenMain}
            // onValueChange={(value) => setShowScreenMain(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </View>
        <View
          style={[
            styles.button,
            { justifyContent: "space-between", height: "auto" },
          ]}
          key={"showGreetingPractics"}
        >
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
            // value={showScreenPractices}
            // onValueChange={(value) => setShowScreenPractices(value)}
            thumbColor={"#FFFFFF"}
            trackColor={{
              true: "#FBBC05",
              false: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </View>
        {/* {isShowCustomUserData ? (
          <Animated.View style={styleCustomUserData} key={"customDatePayment"}>
            <View
              style={[
                styles.button,
                { justifyContent: "space-between", height: "auto" },
              ]}
              key={"selectTypeSubscribe"}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.buttonText}>
                  {core.i18n.t("cc4e7093-444b-4c21-90dd-75b1b06b14b4")}
                </Text>
              </View>
              <Switch
                value={subscribeType === "6 month"}
                onValueChange={(value) =>
                  setSubscribeType(value ? "6 month" : "1 month")
                }
                thumbColor={"#FFFFFF"}
                trackColor={{
                  true: "#FBBC05",
                  false: "rgba(0, 0, 0, 0.4)",
                }}
              />
            </View>
            <View
              style={[
                styles.button,
                { justifyContent: "space-between", height: "auto" },
              ]}
              key={"selectAutopayment"}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="payment" size={24} color="#FFFFFF" />

                <Text style={styles.buttonText}>
                  {core.i18n.t("4d632bda-0a9d-4d6d-84d4-20f56cf030b8")}
                </Text>
              </View>
              <Switch
                value={autoPayment}
                onValueChange={(value) => setAutoPayment(value)}
                thumbColor={"#FFFFFF"}
                trackColor={{
                  true: "#FBBC05",
                  false: "rgba(0, 0, 0, 0.4)",
                }}
              />
            </View>
            <ColorButton
              styleButton={styles.colorButoon}
              styleText={styles.colorButtonText}
              // onPress={async () => {
              //   DateTimePickerAndroid.open({
              //     value: new Date(),
              //     onChange: (_, selectDate) => {
              //       if (selectDate) {
              //         subscribe.setSubscribe(
              //           selectDate,
              //           subscribeType,
              //           autoPayment
              //         );
              //         subscribeInformation?.setSubscribe(
              //           selectDate,
              //           subscribeType,
              //           autoPayment
              //         );
              //       }
              //     },
              //   });
              // }}
            >
              {core.i18n.t("f5f817df-bb6a-4d5c-992f-8fb72c40f081")}
            </ColorButton>
          </Animated.View>
        ) : null} */}
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
    justifyContent: "flex-start",
    paddingBottom: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
  },
  buttonText: {
    marginLeft: 34,
    color: "#FFFFFF",
    ...core.gStyle.font("400"),
    fontSize: 15,
    maxWidth: "70%",
  },
  colorButoon: {},
  colorButtonText: {},
});
