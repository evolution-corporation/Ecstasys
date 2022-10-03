import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  BackHandler,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useBackHandler } from "@react-native-community/hooks";

import { FontAwesome5 } from "@expo/vector-icons";

import Tools, { getApiOff } from "~core";
import GoogleLogo from "~assets/icons/GoogleLogo.svg";
import { ColorButton, ColorWithIconButton } from "~components/dump";
import { contextHook } from "~modules/account";
import type { AuthenticationScreenProps } from "~routes/index";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

var height = Dimensions.get('window').height;

const SelectMethodAuthentication: AuthenticationScreenProps<
  "SelectMethodAuthentication"
> = ({ navigation }) => {
  const { func } = contextHook.account();
  const [isApiOff, setIsApiOff] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [heightBottomBox, setHeightBottomBox] = useState<number | null>(null);
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const result = await getApiOff();
        if (setIsApiOff !== undefined) setIsApiOff(result);
      };
      init().catch(console.error);
    }, [])
  );

  useBackHandler(() => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
    return true;
  });
  return (
    <ImageBackground
      style={styles.background}
      source={require("~assets/rockDrugs.jpg")}
    >
      <View style={styles.devOptions}>
        {__DEV__ ? (
          <TouchableOpacity onPress={() => navigation.navigate("devSetting")}>
            <FontAwesome5 name="dev" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.logoBox}>
        <Image style={[styles.bird]} source={require("./assets/bird.png")} resizeMode={"contain"} />
      </View>
      <View style={styles.greetingBox}>
        <Text style={styles.title}>
          {Tools.i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
          {"\n"}
          <Text style={Tools.gStyle.font("700")}>dmd meditation</Text>
        </Text>
        <View style={styles.swiper}>
          <Swiper
            dotColor={"rgba(255, 255, 255, 0.5)"}
            activeDotColor={"rgba(255, 255, 255, 1)"}
            paginationStyle={{
              justifyContent: "flex-start",
            }}
          >
            <View style={{}}>
              <Text style={styles.swiperText}>
                {Tools.i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35")}
              </Text>
            </View>
            <View style={{}}>
              <Text style={styles.swiperText}>
                {Tools.i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35")}
              </Text>
            </View>
          </Swiper>
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            height: heightBottomBox ?? "auto",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={"#FFFFFF"} size={"large"} />
        </View>
      ) : (
        <View
          style={styles.selectMethodBox}
          onLayout={({ nativeEvent: { layout } }) => {
            if (heightBottomBox === null) setHeightBottomBox(layout.height);
          }}
        >
          {__DEV__ && isApiOff ? (
            <ColorButton
              styleButton={styles.button}
              onPress={() => {
                setIsLoading(true);
                func.authWithTestAccount().catch((error) => {
                  setIsLoading(false);
                  console.error(error);
                });
              }}
            >
              {Tools.i18n.t("efa30007-ef38-408f-b2ca-68c727c1bbc3")}
            </ColorButton>
          ) : null}
          <ColorButton
            styleButton={styles.button}
            onPress={() => {
              navigation.navigate("InputNumberPhone");
            }}
          >
            {Tools.i18n.t("526fba9f-2b69-4fe6-aefd-d491e86e59da")}
          </ColorButton>
          <ColorWithIconButton
            icon={<GoogleLogo />}
            styleButton={styles.button}
            onPress={() => {
              setIsLoading(true);
              func.authenticationWithGoogle().catch(() => {
                if (setIsLoading !== undefined) setIsLoading(false);
              });
            }}
          >
            {Tools.i18n.t("235a94d8-5deb-460a-bf03-e0e30e93df1b")}
          </ColorWithIconButton>
          <Text style={styles.terms}>
            {Tools.i18n.t("4e5aa2a6-29db-44bc-8cf3-96e1ce338442")}{" "}
            <Text style={styles.document}>{Tools.i18n.t("userAgreement")}</Text>{" "}
            {Tools.i18n.t("and")}{" "}
            <Text style={styles.document}>{Tools.i18n.t("userAgreement")}</Text>{" "}
            ecstasys
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  bird:{
    height: height*0.19
  },
  logoBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   },
  greetingBox: {
    height: 200,
  },
  selectMethodBox: {
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 32,
    color: "#FFFFFF",
    lineHeight: 42,
    fontFamily: "Gilroy",
    fontWeight: "700",
  },
  swiper: {
    flex: 1,
  },
  swiperText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    ...Tools.gStyle.font("400"),
  },
  button: {
    marginVertical: 5,
  },
  terms: {
    fontSize: 13,
    lineHeight: 15,
    ...Tools.gStyle.font("400"),
    color: "#FFFFFF",
    textAlign: "center",
  },
  document: {
    ...Tools.gStyle.font("700"),
  },
  devOptions: {
    position: "absolute",
    alignSelf: "flex-end",
  },
});

export default SelectMethodAuthentication;
